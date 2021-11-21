import React from 'react';
import SubscriptionResult from '@GraphQL/SubscriptionHandler';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@GraphQL/SubscriptionHandler';

const App = () => (
    <ApolloProvider client={apolloClient}>
        <SubscriptionResult />
    </ApolloProvider>
);

export default App;
