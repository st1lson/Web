import React from 'react';
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import Style from './Todo.scss';

const Todo = props => {
    const { children, checked, onClickEdit, onClickDelete, onClickCheck } =
        props;

    return (
        <div className={Style.Wrapper}>
            <button onClick={onClickCheck}>
                {checked ? (
                    <MdCheckBox size={32} />
                ) : (
                    <MdCheckBoxOutlineBlank size={32} />
                )}
            </button>
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
