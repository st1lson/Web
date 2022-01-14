import React from 'react';
import Button from '@components/Button/Button';
import Backdrop from './Backdrop/Backdrop';
import Style from './Popup.scss';

const ErrorPopup = props => {
    const { onClick, children } = props;

    return (
        <>
            <div className={Style.Wrapper}>
                Something going wrong...
                {children}
                <div className={Style.Dismiss}>
                    <Button onClick={onClick}>Dismiss</Button>
                </div>
            </div>
            <Backdrop onClick={onClick} />
        </>
    );
};

export default ErrorPopup;
