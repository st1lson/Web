import React, { Component } from 'react';
import Todo from '../Todo/Todo';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Style from './Form.scss';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTodo: '',
            todos: ['Todo123', 'visit gym', 'oleg', 'have a rest'],
            toDelete: '',
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
        let { todos, toDelete } = this.state;

        let index = todos.indexOf(element);
        toDelete = todos[index];
        
        todos.splice(index, 1);
        this.setState({
            todos,
            toDelete
        });
    };

    onSubmit = event => {
        event.preventDefault();

        const { toDelete } = this.state;

        console.log(toDelete);
        async function fetchGraphQL(operationsDoc, operationName, variables) {
            const result = await fetch(
                'https://arriving-chamois-37.hasura.app/v1/graphql',
                {
                    headers: {
                        'content-type': 'application/json',
                        'x-hasura-admin-secret':
                            'R1jLcaDv4iRAEpTV3FWXiYMizryCJGKHBt4LnAUrNRDJDBQ7wRCemsnVFy9AOgs8',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        query: operationsDoc,
                        variables: variables,
                        operationName: operationName,
                    }),
                },
            );
    
            return await result.json();
        }
    
        const operationsDoc = `
            query MyQuery {
                todo {
                    Task
                }
            }
            mutation MyMutation {
                delete_todo(where: {Task: {_eq: "${toDelete}"}) {
                  affected_rows
                }
              }
        `;
    
        function fetchMyQuery() {
            return fetchGraphQL(operationsDoc, 'MyQuery', {});
        }
    
        async function startFetchMyQuery() {
            const { errors, data } = await fetchMyQuery();
    
            if (errors) {
                console.error(errors);
            }

            this.setState = {
                todos: data.todo
            }
            console.log(data.todo);
        }
    
        startFetchMyQuery();
    };

    render() {
        const { newTodo, todos, loading } = this.state;

        return (
            <div className={Style.Wrapper}>
                <h1 className={Style.Title}>Todos</h1>
                <form className={Style.Form}
                    onSubmit={this.onSubmit}>
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
                            <Todo
                                onClick={event =>
                                    this.todoClickHanlder(event, element)
                                }>
                                {element}
                            </Todo>
                        ))}
                    </div>
                    <Button type="submit" disabled={loading}>
                        Press to add
                    </Button>
                </form>
            </div>
        );
    }
}
