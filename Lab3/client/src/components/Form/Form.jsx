import React, { PureComponent } from 'react';
import Todo from '../Todo/Todo';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Style from './Form.scss';
import startFetchQuery from '../../GraphQL/GraphQl';
import Popup from '../Popup/Popup';
import Spinner from '../Spinner/Spinner';

export default class Form extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            newTodo: '',
            todos: [],
            toDelete: '',
            request: '',
            loading: true,
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
                loading: false,
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
        let { request } = this.state;

        const index = todos.map(e => e.Task).indexOf(element);
        const item = todos[index];

        todos.splice(index, 1);
        request = 'delete';
        this.setState({
            todos: [...todos],
            toDelete: item,
            request,
        });

        startFetchQuery(request, { Task: item['Task'] });
    };

    onTodoAdd = event => {
        const { todos, newTodo } = this.state;
        let { request } = this.state;

        if (todos.includes(newTodo) || !newTodo) {
            return;
        }

        request = 'add';
        this.setState({
            todos: [...todos],
            request,
        });

        startFetchQuery(request, { Task: { Task: newTodo } });
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
        let { request } = this.state;

        const index = todos.indexOf(element['Task']);
        element['Checked'] = !element['Checked'];
        todos[index] = element;

        request = 'check';
        this.setState({
            todos: [...todos],
        });

        startFetchQuery(request, {
            Task: element['Task'],
            Checked: element['Checked'],
        });
    };

    onSubmit = event => {
        event.preventDefault();
    };

    popupClick = () => {
        let { todos, inEdit, request, elementInEdit, editedElement } =
            this.state;

        if (!editedElement) {
            this.setState({
                inEdit: !inEdit,
                elementInEdit: '',
                editedElement: '',
            });

            return;
        }

        request = 'update';

        const index = todos.map(e => e.Task).indexOf(elementInEdit);
        todos[index]['Task'] = editedElement;

        startFetchQuery(request, {
            oldTask: elementInEdit,
            newTask: editedElement,
        });

        this.setState({
            todos,
            inEdit: !inEdit,
            elementInEdit: '',
            editedElement: '',
        });
    };

    render() {
        const {
            newTodo,
            todos,
            loading,
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
                            disabled={loading}>
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
                {loading ? <Spinner /> : ''}
                {inEdit ? (
                    <Popup
                        labelText="New todo text:"
                        placeholder={elementInEdit}
                        name="editedElement"
                        type="text"
                        value={editedElement}
                        onChange={event =>
                            this.onChange(event, 'editedElement')
                        }
                        onClick={this.popupClick}></Popup>
                ) : (
                    ''
                )}
            </div>
        );
    }
}
