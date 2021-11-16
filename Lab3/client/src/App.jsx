import React from 'react';
import LastChanges from './components/Form/GraphQL/SubscriptionHandler';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './components/Form/GraphQL/SubscriptionHandler';

const App = () => (
    <ApolloProvider client={apolloClient}>
        <LastChanges />
    </ApolloProvider>
);

export default App;
