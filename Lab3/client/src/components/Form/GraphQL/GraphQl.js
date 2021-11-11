export default function fetchMyQuery(request) {
    return fetchGraphQL(operationsDoc, request, {});
}

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

async function startFetchMyQuery() {
    const { errors, data } = await fetchMyQuery();

    if (errors) {
        // handle those errors like a pro
        console.error(errors);
    }

    // do something great with this precious data

    if (request === 'read') {
        let newTodos = [];
        let i = 0;
        for (i = 0; i < data.todo.length; i++) {
            newTodos.push(data.todo[i]['Task']);
        }

        todos = newTodos;
    }

    console.log(data);
}

startFetchMyQuery();

const operationsDoc = `
   query read {
        todo {
            Task
        }
    }

    mutation add {
        insert_todo(objects: {Task: "${this.state.newTodo}"}) {
          affected_rows
        }
    }

    mutation delete {
        delete_todo(where: {Task: {_eq: "${this.state.toDelete}"}}) {
          affected_rows
        }
    }

    mutation update {
        update_todo(where: {Task: {_eq: "ttttt"}}, _set: {Task: "ttt"}) {
          affected_rows
        }
    }
`;