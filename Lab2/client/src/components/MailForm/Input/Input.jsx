import React from "react";
import Style from './Input.scss';

const Input = (props) => {
    const { labelText, name, type, value, onChange } = props;
    return(
        <div className={Style.Wrapper}>
            <label>{labelText}</label>
            <input 
                name={name}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
} 

export default Input;
