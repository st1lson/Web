import { HASURA_ADMIN_SECRET, URI } from '@GraphQL/config';

let headers;
let isIn;

export default async function startFetchQuery(request, variables, authState) {
    isIn = authState?.status === 'in';
    headers = isIn ? { Authorization: `Bearer ${authState?.token}` } : {};

    const { errors, data } = await fetchQuery(request, variables);

    if (errors) {
        return errors;
    }

    return data;
}

const operationsDoc = `
   query read {
        todo {
            Id
            Task
            Checked
        }
    }

    mutation delete($Id: Int) {
        delete_todo(where: {Id: {_eq: $Id}}) {
          affected_rows
        }
    }

    mutation add($Task: todo_insert_input!) {
        insert_todo(objects: [$Task]) {
            affected_rows
        }
    }

    mutation update($Id: Int!, $newTask: String!) {
        update_todo(where: {Id: {_eq: $Id}}, _set: {Task: $newTask}) {
            affected_rows
        }
    }

    mutation check($Id: Int!, $Checked: Boolean!) {
        update_todo_by_pk(pk_columns: {Id: $Id},
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
        headers,
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
        'x-hasura-role': 'user',
    };
}
