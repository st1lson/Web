import React, { Component } from 'react';
import Todo from '../Todo/Todo';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Style from './Form.scss';
import startFetchMyQuery from './GraphQL/GraphQl';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTodo: '',
            todos: [],
            toDelete: '',
            request: 'read',
            loading: false,
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

        todos.push(newTodo);
        request = 'add';
        this.setState({
            todos,
            request,
        });

        startFetchMyQuery(request, { Task: { Task: newTodo } });
    };

    onSubmit = event => {
        event.preventDefault();
    };

    componentDidMount() {
        let { request } = this.state;

        request = 'read';

        startFetchMyQuery(request, {}).then(data => this.updateTodosData(data.todo));
    }

    updateTodosData(items) {
        let { todos } = this.state;

        const newTodos = [];
        for (let i = 0; i < items.length; i++) {
            newTodos.push(items[i]['Task']);
        }

        if (todos !== newTodos) {
            todos = newTodos;
            this.setState({
                todos,
            });
        }
    }

    render() {
        const { newTodo, todos, loading } = this.state;

        return (
            <div className={Style.Wrapper}>
                <h1 className={Style.Title}>Todos</h1>
                <form
                    className={Style.Form}
                    onSubmit={event => this.onSubmit(event)}
                    method="Post">
                    <div className={Style.TodoWrapper}>
                        {todos.map(element => (
                            <Todo
                                key={element}
                                onClick={event =>
                                    this.todoClickHanlder(event, element)
                                }>
                                {element}
                            </Todo>
                        ))}
                    </div>
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
                        Press to add
                    </Button>
                </form>
            </div>
        );
    }
}
