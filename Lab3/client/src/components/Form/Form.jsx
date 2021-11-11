import React, { Component } from 'react';
import Todo from '../Todo/Todo';
import Input from '../Input/Input';
import Button from '../Button/Button';
import fetchMyQuery from './GraphQL/GraphQl';
import Style from './Form.scss';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTodo: '',
            todos: ['Todo123', 'visit gym', 'oleg', 'have a rest'],
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

        fetchMyQuery(request);
    };

    addTodo = (event)=> {
        const { todos, newTodo } = this.state;
        let { request } = this.state;

        if (todos.includes(newTodo)) {
            return;
        }

        todos.push(newTodo);
        request = 'add';
        this.setState({
            todos,
            request,
        });

        fetchMyQuery(request);
    };

    onSubmit = event => {
        event.preventDefault();

    };

    render() {
        const { newTodo, todos, loading } = this.state;

        return (
            <div className={Style.Wrapper}>
                <h1 className={Style.Title}>Todos</h1>
                <form className={Style.Form}
                    onSubmit={event => this.onSubmit(event)}
                    method="Post">
                    <div className={Style.TodoWrapper}>
                        {todos.map(element => (
                            <Todo
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
                        type="submit" disabled={loading}>
                        Press to add
                    </Button>
                </form>
            </div>
        );
    }
}
