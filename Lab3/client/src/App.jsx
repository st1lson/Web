import React from 'react';
import SubscriptionResult from './components/Form/GraphQL/SubscriptionHandler';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './components/Form/GraphQL/SubscriptionHandler';

const App = () => (
    <ApolloProvider client={apolloClient}>
        <SubscriptionResult />
    </ApolloProvider>
);

export default App;
