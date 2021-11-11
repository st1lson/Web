let value = '';

function fetchMyQuery(request) {
    return fetchGraphQL(operationsDoc, request, {});
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
        'https://arriving-chamois-37.hasura.app/v1/graphql',
        {
            headers: setHeaders(),
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

export default async function startFetchMyQuery(request, item) {
    value = item;
    console.log(request, value);
    const { errors, data } = await fetchMyQuery(request, item);

    if (errors) {
        // handle those errors like a pro
        console.error(errors);
    }

    // do something great with this precious data

    if (request === 'read') {
        const newTodos = [];
        for (let i = 0; i < data.todo.length; i++) {
            newTodos.push(data.todo[i]['Task']);
        }

        return newTodos;
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
        insert_todo(objects: {Task: "${value}"}) {
          affected_rows
        }
    }

    mutation delete {
        delete_todo(where: {Task: {_eq: "${value}"}}) {
          affected_rows
        }
    }

    mutation update {
        update_todo(where: {Task: {_eq: "ttttt"}}, _set: {Task: "ttt"}) {
          affected_rows
        }
    }
`;

function setHeaders() {
    return {
        'content-type': 'application/json',
        'x-hasura-admin-secret':
            'R1jLcaDv4iRAEpTV3FWXiYMizryCJGKHBt4LnAUrNRDJDBQ7wRCemsnVFy9AOgs8',
    };
}