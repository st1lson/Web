import React from 'react';
import Style from './Input.scss';

const Input = props => {
    const { labelText, placeholder, name, type, value, onChange } = props;
    return (
        <div className={Style.Wrapper}>
            <label>{labelText}</label>
            <input
                placeholder={placeholder}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Input;
