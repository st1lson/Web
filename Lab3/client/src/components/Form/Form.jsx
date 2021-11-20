import React, { PureComponent } from 'react';
import Todo from '../Todo/Todo';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Style from './Form.scss';
import startFetchQuery from '../../GraphQL/GraphQl';
import EditPopup from '../Popup/EditPopup';
import ErrorPopup from '../Popup/ErrorPopup';
import Spinner from '../Spinner/Spinner';

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
    }

    componentDidUpdate = () => {
        if (this.props.data) {
            const todos = this.props.data.todo;
            this.setState({
                todos,
                isLoading: false,
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

        todos.splice(index, 1);
        this.setState({
            todos: [...todos],
            toDelete: item,
        });

        startFetchQuery('delete', { Task: item['Task'] }).then(result => {
            if (result[0]?.message) {
                this.setState({
                    error: <p error="true">{result[0].message}</p>,
                    isError: true,
                });
            }
        });
    };

    onTodoAdd = event => {
        const { todos, newTodo } = this.state;

        if (todos.includes(newTodo) || !newTodo) {
            return;
        }

        this.setState({
            todos: [...todos],
        });

        startFetchQuery('add', { Task: { Task: newTodo } }).then(result => {
            if (result[0]?.message) {
                this.setState({
                    error: <p error="true">{result[0].message}</p>,
                    isError: true,
                });
            }
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
        });

        startFetchQuery('check', {
            Task: element['Task'],
            Checked: element['Checked'],
        }).then(result => {
            if (result[0]?.message) {
                this.setState({
                    error: <p error="true">{result[0].message}</p>,
                    isError: true,
                });
            }
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

        startFetchQuery('update', {
            oldTask: elementInEdit,
            newTask: editedElement,
        }).then(result => {
            if (result[0]?.message) {
                this.setState({
                    error: <p error="true">{result[0].message}</p>,
                    isError: true,
                });
            }
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
