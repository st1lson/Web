import React from 'react';
import Button from '../Button/Button';
import Backdrop from './Backdrop/Backdrop';
import Input from '../Input/Input';
import Style from './Popup.scss';

const Popup = props => {
    const { onClick, placeholder, labelText, name, type, value, onChange } =
        props;

    return (
        <>
            <div className={Style.Wrapper}>
                <Input
                    className={Style.Field}
                    labelText={labelText}
                    placeholder={placeholder}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                />
                <div className={Style.Dismiss}>
                    <Button onClick={onClick}>Change</Button>
                </div>
            </div>
            <Backdrop onClick={onClick} />
        </>
    );
};

export default Popup;
