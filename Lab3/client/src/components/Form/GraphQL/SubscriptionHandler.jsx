import React from 'react';
import {
    ApolloClient,
    InMemoryCache,
    split,
    useSubscription,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from '@apollo/client/link/ws';
import gql from 'graphql-tag';
import Layout from '../../../Layout/Layout';
import { setHeaders } from './GraphQl';

const httpLink = new HttpLink({
    uri: 'https://arriving-chamois-37.hasura.app/v1/graphql',
});

const wsLink = new WebSocketLink({
    uri: 'wss://arriving-chamois-37.hasura.app/v1/graphql',
    options: {
        reconnect: true,
        connectionParams: {
            headers: setHeaders(),
        },
    },
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
);

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link,
});

const tasksSubscriptions = gql`
    subscription tasksSubscriptions {
        todo {
            Checked
            Task
        }
    }
`;

export default function LastChanges() {
    const { data, loading } = useSubscription(tasksSubscriptions);
    console.log(data);
    return <Layout data={data} />;
}
