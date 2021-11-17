import React, { PureComponent } from 'react';
import Todo from '../Todo/Todo';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Style from './Form.scss';
import startFetchMyQuery from './GraphQL/GraphQl';
import Popup from '../Popup/Popup';

export default class Form extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            newTodo: '',
            todos: [],
            toDelete: '',
            request: 'read',
            loading: false,
            inEdit: false,
            elementInEdit: '',
            editedElement: '',
        };
    }

    componentDidUpdate = () => {
        if (this.props.data) {
            const todos = this.props.data.todo;
            this.setState({ todos });
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

    todoClickHanlder = (event, element) => {
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

        startFetchMyQuery(request, { Task: item['Task'] });
    };

    addTodo = event => {
        const { todos, newTodo } = this.state;
        let { request } = this.state;

        if (todos.includes(newTodo) || !newTodo) {
            return;
        }

        todos.push({ Task: newTodo, Checked: false });
        request = 'add';
        this.setState({
            todos: [...todos],
            request,
        });

        startFetchMyQuery(request, { Task: { Task: newTodo } });
    };

    editTodo = (event, element) => {
        let { inEdit, elementInEdit } = this.state;

        inEdit = true;
        elementInEdit = element;

        this.setState({
            inEdit,
            elementInEdit,
        });
    };

    checkTodo = (event, element) => {
        const { todos } = this.state;
        let { request } = this.state;

        const index = todos.indexOf(element['Task']);
        element['Checked'] = !element['Checked'];
        todos[index] = element;

        request = 'check';
        this.setState({
            todos: [...todos],
        });

        startFetchMyQuery(request, {
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

        startFetchMyQuery(request, {
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
                            onClick={event => this.addTodo(event)}
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
                                    this.editTodo(event, element['Task'])
                                }
                                onClickDelete={event =>
                                    this.todoClickHanlder(
                                        event,
                                        element['Task'],
                                    )
                                }
                                onClickCheck={event =>
                                    this.checkTodo(event, element)
                                }>
                                {element['Task']}
                            </Todo>
                        ))}
                    </div>
                </form>
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
