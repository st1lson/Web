import React, { Component } from 'react';
import axios from '../../axiosConfig';
import Style from './MailForm.scss';
import Input from './Input/Input';
import TextArea from './TextArea/TextArea';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';

export default class MailForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			author: '',
			text: '',
			loading: false,
		};
	}

    onChange = (event, name) => {
    	const { [name]: value } = this.state;
    	if (value !== event.target.value) {
    		this.setState({
    			[name]: event.target.value,
    		});
    	}
    }

    onSubmit = event => {
    	event.preventDefault();

    	const email = event.target.email.value;
    	const author = event.target.author.value;
    	const text = event.target.text.value;

    	if (!email) {
    		alert('Invalid email address');
    		return;
    	}

    	if (!text) {
    		alert('Text block can not be empty');
    		return;
    	}

    	this.setState({
    		loading: true,
    	});

    	axios.
    		post('mails', {
    			email,
    			author,
    			text,
    		}).
    		then(
    			response => {
    				this.setState({
    					loading: false,
    				});
    				alert(
    					`Mail successfully delivered to ${response.data.email}`,
    				);
    			}).
    		catch(
    			error => {
    				alert(`Error with code ${error.status}`);
    			});
    }

    render() {
    	const { email, author, text, loading } = this.state;
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
    				{loading ? <Spinner /> : <Button
    					name="submit"
    					type="submit"
    					disabled={loading}>
                        Submit
    				</Button>}
    			</form>
    		</div>
    	);
    }
}
