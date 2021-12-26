import React from 'react';
import Form from '@components/Form/Form';

const Layout = props => {
    const { data } = props;

    return (
        <div>
            <Form data={data} />
        </div>
    );
};

export default Layout;
