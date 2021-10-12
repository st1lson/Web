import React from 'react';
import Style from './Layout.scss';
import logo from './logo.png';

const Layout = props => {
    const { children } = props;

    return (
        <div>
            <header>
                <p>
                    <a href="https://github.com/st1lson/Web/tree/lab2">
                        <img
                            src={logo}
                            className={Style.Img}
                            alt="logo"
                            width="100"
                            height="100"/>
                    </a>
                </p>
                <h1>Mail sender</h1>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
