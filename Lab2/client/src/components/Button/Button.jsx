import React from 'react';
import Style from './Button.scss';

const Button = props => {
    const { name, onClick, disabled, children } = props;
    return (
        <button
            className={Style.Button}
            name={name}
            onClick={onClick}
            disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
