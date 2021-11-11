export default async function startFetchMyQuery(request, variables) {
    const { errors, data } = await fetchMyQuery(request, variables);

    if (errors) {
        // handle those errors like a pro
        console.error(errors);
    }

    return data;
}

const operationsDoc = `
   query read {
        todo {
            Task
        }
    }

    mutation delete($Task: String!) {
        delete_todo_by_pk(Task: $Task) {
            Task
        }
    }

    mutation add($Task: todo_insert_input!) {
        insert_todo(objects: [$Task]) {
            affected_rows
        }
    }

    mutation update($oldTask: String!, $newTask: String!) {
        update_todo_by_pk(pk_columns: {Task: $oldTask}, 
             _set: {Task: $newTask}) {
            Task
          }
    }
`;

async function fetchMyQuery(request, variables) {
    return fetchGraphQL(operationsDoc, request, variables);
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
        'https://arriving-chamois-37.hasura.app/v1/graphql',
        {
            headers: setHeaders(),
            method: 'POST',
            body: JSON.stringify({
                query: operationsDoc,
                variables,
                operationName,
            }),
        },
    );

    const res = await result.json();
    return res;
}

function setHeaders() {
    return {
        'content-type': 'application/json',
        'x-hasura-admin-secret':
            'R1jLcaDv4iRAEpTV3FWXiYMizryCJGKHBt4LnAUrNRDJDBQ7wRCemsnVFy9AOgs8',
    };
}
