import React from 'react';
import Button from '../Button/Button';
import Backdrop from './Backdrop/Backdrop';
import Style from './Popup.scss';

const Popup = props => {
    const { onClick, children } = props;

    return (
        <>
            <div className={Style.Wrapper}>
                {children}
                <div className={Style.Dismiss}>
                    <Button onClick={onClick}>Dismiss</Button>
                </div>
            </div>
            <Backdrop onClick={onClick} />
        </>
    );
};

export default Popup;
