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
            toDeleteId: 0,
            isLoading: true,
            isError: false,
            inEdit: false,
            elementInEdit: 0,
            elementId: 0,
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

        this.setState({
            todos: [...todos],
            toDelete: element,
            isLoading: true,
        });

        startFetchQuery('delete', { Id: element }, this.props.authState)
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
        this.setState({
            inEdit: true,
            elementInEdit: element['Task'],
            elementId: element['Id'],
        });
    };

    onTodoCheck = (event, element) => {
        const { todos } = this.state;

        const index = todos.indexOf(element['Id']);
        element['Checked'] = !element['Checked'];
        todos[index] = element;

        this.setState({
            todos: [...todos],
            isLoading: true,
        });

        startFetchQuery(
            'check',
            {
                Id: element['Id'],
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
        let { todos, inEdit, elementId, editedElement } = this.state;

        if (!editedElement) {
            this.setState({
                inEdit: !inEdit,
                elementId: 0,
                elementInEdit: '',
                editedElement: '',
            });

            return;
        }

        startFetchQuery(
            'update',
            {
                Id: elementId,
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
                                key={element['Id']}
                                checked={element['Checked']}
                                onClickEdit={event =>
                                    this.onTodoEdit(event, element)
                                }
                                onClickDelete={event =>
                                    this.onTodoDelete(event, element['Id'])
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
