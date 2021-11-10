import React, { Component } from "react";
import Todo from '../Todo/Todo';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Style from './Form.scss';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTodo: '',
            todos: ['visit gym',
                    'have a rest'],
            loading: false,
            date: '',
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

    todoClickHanlder = (event) => {
        alert("Are you sure?");
    }

    onSubmit = event => {
        alert(event.target.value);
        console.log("sub");
    }

    render() {
        const { newTodo, todos, loading } = this.state;

        return (
            <div className={Style.Wrapper}>
                <h1 className={Style.Title}>Todos</h1>
                <form
                    className={Style.Form}>
                        <Input
                            labelText="Your todo:"
                            placeholder="Todo"
                            name="newTodo"
                            type="text"
                            value={newTodo}
                            onChange={event => this.onChange(event, 'newTodo')}
                        />
                        <div className={Style.TodoWrapper}>
                            {todos.map(element => (
                                <Todo onClick={event => this.todoClickHanlder(event)}>
                                    {element}
                                </Todo>
                            ))}
                        </div>
                        <Button type="add" onClick={this.onSubmit} disabled={loading}>
                            Press to add
                        </Button>
                </form>
            </div>
        );
    }
}