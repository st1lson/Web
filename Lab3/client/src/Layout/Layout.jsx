import React from 'react';
import Form from '@components/Form/Form';

const Layout = props => {
    const { data } = props;

    return (
        <div>
            <header>
                <h1>To Do</h1>
            </header>
            <Form data={data} />
        </div>
    );
};

export default Layout;
