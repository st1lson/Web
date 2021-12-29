import React, { useState } from 'react';
import {
    ApolloClient,
    InMemoryCache,
    concat,
    useSubscription,
    ApolloProvider,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import gql from 'graphql-tag';
import Auth from '@components/Auth/Auth';
import { setContext } from '@apollo/client/link/context';
import { URI_WSS } from '@GraphQL/config';

const authState = { token: '' };

const tasksSubscriptions = gql`
    subscription Subscription {
        todo(order_by: { Task: asc, Checked: asc }) {
            Task
            Checked
        }
    }
`;

export function SubscriptionResult(props) {
    const { changeToken } = props;

    const { data } = useSubscription(tasksSubscriptions, {
        UserId: authState?.user?.uid,
    });

    return (
        <>
            <Auth changeToken={changeToken} authState={authState} data={data} />
        </>
    );
}

function Subscription() {
    const [bearerToken, setBearerToken] = useState('');

    const authLink = setContext((_, { headers }) => {
        if (!bearerToken) return { headers };

        return {
            headers: {
                ...headers,
                Authorization: `Bearer ${bearerToken}`,
            },
        };
    });

    const wsLink = new WebSocketLink({
        uri: URI_WSS,
        options: {
            reconnect: true,
            connectionParams: () => {
                return {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                    },
                };
            },
        },
    });

    const client = new ApolloClient({
        link: concat(authLink, wsLink),
        cache: new InMemoryCache({
            typePolicies: {
                Subscription: {
                    fields: {
                        todos: {
                            merge: false,
                        },
                    },
                },
            },
        }),
    });
    return (
        <ApolloProvider client={client}>
            <SubscriptionResult
                changeToken={token => {
                    setBearerToken(token);
                }}
            />
        </ApolloProvider>
    );
}

export default Subscription;
