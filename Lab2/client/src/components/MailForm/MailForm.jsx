import React, { Component } from 'react';
import axios from '../../axiosConfig';
import Style from './MailForm.scss';
import Input from './Input/Input';
import TextArea from './TextArea/TextArea';
import Button from '../Button/Button';
import Popup from '../Popup/Popup';
import Spinner from '../Spinner/Spinner';

export default class MailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            author: '',
            text: '',
            loading: false,
            requestText: '',
            isError: false,
            errors: [],
        };
    }

    onChange = (event, name) => {
        const { [name]: value } = this.state;
        if (value !== event.target.value) {
            this.setState({
                [name]: event.target.value,
            });
        }
    };

    onSubmit = event => {
        event.preventDefault();

        const { email, author, text } = this.state;

        if (!email) {
            this.setState({
                requestEnded: true,
                requestText: 'Email address field can not be empty',
            });
            return;
        }

        if (!text) {
            this.setState({
                requestEnded: true,
                requestText: 'Text block can not be empty',
            });
            return;
        }

        this.setState({
            loading: true,
        });

        axios
            .post('mails', {
                email,
                author,
                text,
            })
            .then(response => {
                this.setState({
                    loading: false,
                    requestEnded: true,
                    requestText: `Mail successfully delivered to ${response.data.email}`,
                });
            })
            .catch(error => {
                const errorsJson = error.response.data.errors;
                let errors = [];

                if (errorsJson) {
                    for (const key in errorsJson) {
                        errors.push(
                            <p key={key} error="true">
                                {errorsJson[key]}
                            </p>,
                        );
                    }
                }

                this.setState({
                    loading: false,
                    requestEnded: true,
                    requestText: '',
                    isError: true,
                    errors,
                });
            });
    };

    onPopupDismiss = () => {
        this.setState({
            requestText: '',
            errors: [],
            isError: false,
        });
    };

    render() {
        const { email, author, text, loading, isError, requestText, errors } =
            this.state;

        return (
            <div className={Style.Wrapper}>
                <h1 className={Style.Title}>Type data below</h1>
                <form
                    className={Style.Form}
                    onSubmit={this.onSubmit}
                    method="post">
                    <Input
                        labelText="Enter a recipient email:"
                        placeholder="example@gmail.com"
                        name="email"
                        type="text"
                        value={email}
                        onChange={event => this.onChange(event, 'email')}
                    />
                    <Input
                        labelText="Enter your name:"
                        placeholder="Matthew"
                        name="author"
                        type="text"
                        value={author}
                        onChange={event => this.onChange(event, 'author')}
                    />
                    <TextArea
                        labelText="Enter your message:"
                        placeholder="Hello, how are you?"
                        name="text"
                        type="text"
                        value={text}
                        onChange={event => this.onChange(event, 'text')}
                    />
                    <Button name="submit" type="submit" disabled={loading}>
                        Submit
                    </Button>
                    {loading ? <Spinner /> : ''}
                </form>
                {requestText ? (
                    <Popup onClick={this.onPopupDismiss}>
                        {<p success="true">{requestText}</p>}
                    </Popup>
                ) : (
                    ''
                )}
                {isError ? (
                    <Popup onClick={this.onPopupDismiss}>{errors}</Popup>
                ) : (
                    ''
                )}
            </div>
        );
    }
}
