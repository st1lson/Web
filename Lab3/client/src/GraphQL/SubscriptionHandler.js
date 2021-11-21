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
import Layout from '@Layout/Layout';
import { setHeaders } from '@GraphQL/GraphQl';
import { URI, URI_WSS } from '@GraphQL/config';

const httpLink = new HttpLink({
    uri: URI,
});

const wsLink = new WebSocketLink({
    uri: URI_WSS,
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
    subscription Subscription {
        todo(order_by: { Task: asc, Checked: asc }) {
            Task
            Checked
        }
    }
`;

export default function SubscriptionResult() {
    const { data } = useSubscription(tasksSubscriptions);

    return <Layout data={data} />;
}
