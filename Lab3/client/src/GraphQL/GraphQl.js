import { HASURA_ADMIN_SECRET, URI } from './config';

export default async function startFetchQuery(request, variables) {
    const { errors, data } = await fetchQuery(request, variables);

    if (errors) {
        console.error(errors);
        return errors;
    }

    return data;
}

const operationsDoc = `
   query read {
        todo {
            Task
            Checked
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

    mutation check($Task: String!, 
        $Checked: Boolean!) {
        update_todo_by_pk(pk_columns: {Task: $Task},
             _set: {Checked: $Checked}) {
            Checked
          }
    }
`;

async function fetchQuery(request, variables) {
    return fetchGraphQL(operationsDoc, request, variables);
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(URI, {
        headers: setHeaders(),
        method: 'POST',
        body: JSON.stringify({
            query: operationsDoc,
            variables,
            operationName,
        }),
    });

    const res = await result.json();
    return res;
}

export function setHeaders() {
    return {
        'content-type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
    };
}
