import React from 'react';

const Layout = props => {
    const { children } = props;

    return (
        <div>
            <header>
                <h1>To Do</h1>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
