import React from 'react';
import Style from './Backdrop.scss';

const Backdrop = props => {
    const { onClick } = props;

    return <div className={Style.Backdrop} onClick={onClick} />;
};

export default Backdrop;
