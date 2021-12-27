import React, { PureComponent } from 'react';
import Todo from '@components/Todo/Todo';
import Input from '@components/Input/Input';
import Button from '@components/Button/Button';
import startFetchQuery from '@GraphQL/GraphQl';
import EditPopup from '@components/Popup/EditPopup';
import ErrorPopup from '@components/Popup/ErrorPopup';
import Spinner from '@components/Spinner/Spinner';
import Style from './Form.scss';

export default class Form extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            newTodo: '',
            todos: [],
            error: '',
            toDelete: '',
            isLoading: true,
            isError: false,
            inEdit: false,
            elementInEdit: '',
            editedElement: '',
        };

        this.readData();
    }

    readData = () => {
        let todos = [];
        this.setState({ isLoading: true });

        startFetchQuery('read', {}, this.props.authState)
            .then(result => {
                if (result[0]?.message) {
                    this.setState({
                        error: <p error="true">{result[0]?.message}</p>,
                        isError: true,
                    });
                }

                todos = result?.todo;
                this.setState({ todos, isLoading: false });
            })
            .catch(() => {
                this.setState({
                    error: <p error="true">Something going wrong...</p>,
                    isError: true,
                    isLoading: false,
                });
            });
    };

    componentDidUpdate = () => {
        if (this.props?.data) {
            const todos = this.props.data.todo;
            this.setState({
                todos,
            });
        }
    };

    onChange = (event, name) => {
        const { [name]: value } = this.state;
        if (value !== event.target.value) {
            this.setState({
                [name]: event.target.value,
            });
        }
    };

    onTodoDelete = (event, element) => {
        const { todos } = this.state;

        const index = todos.map(e => e.Task).indexOf(element);
        const item = todos[index];

        this.setState({
            todos: [...todos],
            toDelete: item,
            isLoading: true,
        });

        startFetchQuery('delete', { Task: item['Task'] }, this.props.authState)
            .then(result => {
                if (result[0]?.message) {
                    this.setState({
                        error: <p error="true">{result[0]?.message}</p>,
                        isError: true,
                    });
                }

                this.setState({ isLoading: false });
            })
            .catch(() => {
                this.setState({
                    error: <p error="true">Something going wrong...</p>,
                    isError: true,
                    isLoading: false,
                });
            });
    };

    onTodoAdd = event => {
        const { todos, newTodo } = this.state;

        if (todos.includes(newTodo) || !newTodo) {
            return;
        }

        this.setState({
            todos: [...todos],
            isLoading: true,
        });

        startFetchQuery(
            'add',
            { Task: { Task: newTodo } },
            this.props.authState,
        )
            .then(result => {
                if (result[0]?.message) {
                    this.setState({
                        error: <p error="true">{result[0]?.message}</p>,
                        isError: true,
                    });
                }

                this.setState({ isLoading: false });
            })
            .catch(() => {
                this.setState({
                    error: <p error="true">Something going wrong...</p>,
                    isError: true,
                    isLoading: false,
                });
            });
    };

    onTodoEdit = (event, element) => {
        let { inEdit, elementInEdit } = this.state;

        inEdit = true;
        elementInEdit = element;

        this.setState({
            inEdit,
            elementInEdit,
        });
    };

    onTodoCheck = (event, element) => {
        const { todos } = this.state;

        const index = todos.indexOf(element['Task']);
        element['Checked'] = !element['Checked'];
        todos[index] = element;

        this.setState({
            todos: [...todos],
            isLoading: true,
        });

        startFetchQuery(
            'check',
            {
                Task: element['Task'],
                Checked: element['Checked'],
            },
            this.props.authState,
        )
            .then(result => {
                if (result[0]?.message) {
                    this.setState({
                        error: <p error="true">{result[0]?.message}</p>,
                        isError: true,
                    });
                }

                this.setState({ isLoading: false });
            })
            .catch(() => {
                element['Checked'] = !element['Checked'];
                todos[index] = element;
                this.setState({
                    todos: [...todos],
                    error: <p error="true">Something going wrong...</p>,
                    isError: true,
                    isLoading: false,
                });
            });
    };

    onSubmit = event => {
        event.preventDefault();
    };

    onPopupClick = () => {
        let { todos, inEdit, elementInEdit, editedElement } = this.state;

        if (!editedElement) {
            this.setState({
                inEdit: !inEdit,
                elementInEdit: '',
                editedElement: '',
            });

            return;
        }

        startFetchQuery(
            'update',
            {
                oldTask: elementInEdit,
                newTask: editedElement,
            },
            this.props.authState,
        )
            .then(result => {
                if (result[0]?.message) {
                    this.setState({
                        error: <p error="true">{result[0]?.message}</p>,
                        isError: true,
                    });
                }
            })
            .catch(() => {
                this.setState({
                    error: <p error="true">Something going wrong...</p>,
                    isError: true,
                    isLoading: false,
                });
            });

        this.setState({
            todos,
            inEdit: !inEdit,
            elementInEdit: '',
            editedElement: '',
        });
    };

    onErrorPopup = () => {
        this.setState({
            isError: false,
            errors: [],
        });
    };

    render() {
        const {
            newTodo,
            todos,
            error,
            isLoading,
            isError,
            inEdit,
            elementInEdit,
            editedElement,
        } = this.state;

        return (
            <div className={Style.Wrapper}>
                <form
                    className={Style.Form}
                    onSubmit={event => this.onSubmit(event)}
                    method="Post">
                    <div className={Style.InputWrapper}>
                        <Input
                            labelText="Your todo:"
                            placeholder="Todo"
                            name="newTodo"
                            type="text"
                            value={newTodo}
                            onChange={event => this.onChange(event, 'newTodo')}
                        />
                        <Button
                            onClick={event => this.onTodoAdd(event)}
                            type="submit"
                            disabled={isLoading}>
                            Add
                        </Button>
                    </div>
                    <div className={Style.TodoWrapper}>
                        {todos.map(element => (
                            <Todo
                                key={element['Task']}
                                checked={element['Checked']}
                                onClickEdit={event =>
                                    this.onTodoEdit(event, element['Task'])
                                }
                                onClickDelete={event =>
                                    this.onTodoDelete(event, element['Task'])
                                }
                                onClickCheck={event =>
                                    this.onTodoCheck(event, element)
                                }>
                                {element['Task']}
                            </Todo>
                        ))}
                    </div>
                </form>
                {isLoading ? <Spinner /> : ''}
                {isError ? (
                    <ErrorPopup onClick={this.onErrorPopup}>{error}</ErrorPopup>
                ) : (
                    ''
                )}
                {inEdit ? (
                    <EditPopup
                        labelText="New todo text:"
                        placeholder={elementInEdit}
                        name="editedElement"
                        type="text"
                        value={editedElement}
                        onChange={event =>
                            this.onChange(event, 'editedElement')
                        }
                        onClick={this.onPopupClick}></EditPopup>
                ) : (
                    ''
                )}
            </div>
        );
    }
}
