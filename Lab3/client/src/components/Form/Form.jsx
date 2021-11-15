import React, { Component } from 'react';
import Todo from '../Todo/Todo';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Style from './Form.scss';
import startFetchMyQuery from './GraphQL/GraphQl';
import Popup from '../Popup/Popup';

export default class Form extends Component {
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

        let index = todos.indexOf(element);
        const item = todos[index];

        todos.splice(index, 1);
        request = 'delete';
        this.setState({
            todos,
            toDelete: item,
            request,
        });

        startFetchMyQuery(request, { Task: item });
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
            todos,
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

        const index = todos.indexOf(element['Task']);
        element['Checked'] = !element['Checked'];
        todos[index] = element;

        this.setState({
            todos,
        });
    };

    onSubmit = event => {
        event.preventDefault();
    };

    componentDidMount() {
        let { request } = this.state;

        request = 'read';

        startFetchMyQuery(request, {})
            .then(data => this.updateTodosData(data.todo))
            .catch(errors => console.log(errors));
    }

    updateTodosData(items) {
        let { todos } = this.state;

        const newTodos = [];
        for (let i = 0; i < items.length; i++) {
            newTodos.push(items[i]);
        }

        if (todos !== newTodos) {
            todos = newTodos;
            this.setState({
                todos,
            });
        }
    }

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

        const index = todos.indexOf(elementInEdit);
        todos[index] = editedElement;

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
