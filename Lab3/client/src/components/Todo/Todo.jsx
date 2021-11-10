import React from 'react';
import Style from './Todo.scss';

const Todo = props => {
    const { children, onClick } = props;

    return (
        <div className={Style.Wrapper}>
            <div className={Style.TodoWrapper}>{children}</div>
            <button onClick={onClick}>
                &#10006;
            </button>
        </div>
    );
};

export default Todo;
