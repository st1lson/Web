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
import Auth from '@components/Auth/Auth';
import { setHeaders } from '@GraphQL/GraphQl';
import { setContext } from '@apollo/client/link/context';
import { URI, URI_WSS } from '@GraphQL/config';

const authState = { token: '' };

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

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            Authorization: `Bearer ${authState?.token}`,
        },
    };
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
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
    console.log(authState);

    const { data } = useSubscription(tasksSubscriptions, {
        UserId: authState?.user?.uid,
    });

    return (
        <>
            <Auth authState={authState} data={data} />
        </>
    );
}
