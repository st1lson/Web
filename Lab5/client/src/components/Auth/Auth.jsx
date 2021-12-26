import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import React from 'react';
import classes from './Auth.scss';
import ErrorPopup from '@components/Popup/ErrorPopup';
import Form from '@components/Form/Form';
import Spinner from '@components/Spinner/Spinner';
import Button from '@components/Button/Button';

class Auth extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            authState: {},
            provider: '',
            data: props.data,
            isLoading: false,
            isError: false,
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.setState({ provider: new firebase.auth.GoogleAuthProvider() });
        firebase.initializeApp({
            apiKey: 'AIzaSyACE-Y0Gtprv7mTSvEYlsLWT-wEoDhWiwk',
            authDomain: 'auth-lab5.firebaseapp.com',
            databaseURL:
                'https://auth-lab5-default-rtdb.europe-west1.firebasedatabase.app',
            projectId: 'auth-lab5',
            storageBucket: 'auth-lab5.appspot.com',
            messagingSenderId: '531262301326',
        });
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                const token = await user.getIdToken();
                const idTokenResult = await user.getIdTokenResult();
                const hasuraClaim =
                    idTokenResult.claims['https://hasura.io/jwt/claims'];
                this.props.authState.token = token;
                this.props.authState.user = user;
                if (hasuraClaim) {
                    this.setState({ authState: { status: 'in', user, token } });
                } else {
                    const metadataRef = firebase
                        .database()
                        .ref('metadata/' + user.uid + '/refreshTime');

                    metadataRef.on('value', async data => {
                        if (!data.exists) return;
                        const token = await user.getIdToken(true);
                        this.setState({
                            authState: { status: 'in', user, token },
                        });
                    });
                }
            } else {
                this.setState({ authState: { status: 'out' } });
            }
        });
    }

    signIn = async event => {
        event.preventDefault();
        const { provider } = this.state;
        try {
            this.setState({ isLoading: true });
            await firebase.auth().signInWithPopup(provider);
            this.setState({ isLoading: false });
        } catch (error) {
            this.setState({ isLoading: false, isError: true });
        }
    };

    signOut = async event => {
        event.preventDefault();
        try {
            this.setState({ isLoading: true });
            await firebase.auth().signOut();
            this.setState({ isLoading: false });
        } catch (error) {
            this.setState({ isLoading: false, isError: true });
        }
    };

    handleInputChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    };

    render() {
        const { authState, isLoading, isError } = this.state;
        return (
            <>
                {isLoading ? <Spinner /> : ''}
                <header>
                    <h1>Todos</h1>
                    <div className={classes.buttonContainer}>
                        {authState?.status === 'in' ? (
                            <Button onClick={this.signOut}> Sign out</Button>
                        ) : (
                            <Button onClick={this.signIn}> Sign in</Button>
                        )}
                    </div>
                </header>
                {authState?.status === 'in' ? (
                    <Form
                        authState={authState}
                        data={this.props.data}
                        ref={this.myRef}
                    />
                ) : (
                    ''
                )}
                {isError ? (
                    <ErrorPopup
                        onClick={() => this.setState({ isError: false })}>
                        Error
                    </ErrorPopup>
                ) : (
                    ''
                )}
            </>
        );
    }
}

export default Auth;
