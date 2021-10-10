import React from "react";
import Style from './TextArea.scss';

const TextArea = props => {
    const { labelText, name, type, value, onChange } = props;
    return(
        <div className={Style.Wrapper}>
            <label>{labelText}</label>
            <textarea
                name={name}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default TextArea;