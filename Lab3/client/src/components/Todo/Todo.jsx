import React from 'react';
import Style from './Todo.scss';

const Todo = props => {
    const { children, onClickEdit, onClickDelete } = props;

    return (
        <div className={Style.Wrapper}>
            <div className={Style.TodoWrapper}>{children}</div>
            <button type="button" onClick={onClickEdit}>
                &#9998;
            </button>
            <button type="button" onClick={onClickDelete}>
                &#10006;
            </button>
        </div>
    );
};

export default Todo;
