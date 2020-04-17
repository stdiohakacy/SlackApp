import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { isEmailValid } from '../../helpers/DataHelper'
import firebase from '../../firebase'
import md5 from 'md5'

class Register extends Component {
    state = {
        username: '',
        password: '',
        email: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref("users")
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return (
            !username.length || 
            !email.length || 
            !password.length || 
            !passwordConfirmation.length
        )
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6)
            return false
        else if (password !== passwordConfirmation)
            return false
        else
            return true
    }

    isFormValid = () => {
        let errors = []
        let error
        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields' }
            this.setState({ errors: errors.concat(error) })
        }
        else if (!this.isPasswordValid(this.state)) {
            error = { message: 'Password is invalid' }
            this.setState({ errors: errors.concat(error) })
            return false
        }
        else if(!isEmailValid(this.state)) {
            error = {message : 'Email is invalid'}
            this.setState({errors : errors.concat(error)})
            return false
        }
        else
            return true
    }

    displayErrors = (errors) => errors.map((error, idx) => <p key={idx}>{error.message}</p>)

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }

    handleInputError = (errors, inputName) => {
        return errors.some(error => {
            console.log(error)
            return error.message.toLowerCase().includes(inputName)
        }) ? 'error' : ''
    }
    
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true })
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    createdUser.user.updateProfile({
                        displayName: this.state.username, 
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    }).then(() => {
                        this.saveUser(createdUser).then(() => {
                            console.log('user saved!')
                            // this.props.history.push('/')
                        })
                    }).catch(error => {
                        this.setState({
                            errors: this.state.errors.concat(error),
                            loading: false
                        })
                        console.log(error)
                    })
                    this.setState({ loading: false })
                    console.log(createdUser)
                })
                .catch(error => {
                    this.setState({ errors: this.state.errors.concat(error), loading: true })
                    console.log(error)
                })
        }
    }

    render() {
        const { username, password, email, passwordConfirmation, errors, loading } = this.state
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }} >
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register Account
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                fluid name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                onChange={this.handleChange}
                                value={username}
                                className={this.handleInputError(errors, 'username')}
                                type="text" />
                            <Form.Input
                                fluid name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                onChange={this.handleChange}
                                value={email}
                                className={this.handleInputError(errors, 'email')}
                                type="email" />
                            <Form.Input
                                fluid name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                value={password}
                                onChange={this.handleChange}
                                className={this.handleInputError(errors, 'password')}
                                type="password" />
                            <Form.Input
                                fluid name="passwordConfirmation"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Password Confirmation"
                                onChange={this.handleChange}
                                value={passwordConfirmation}
                                className={this.handleInputError(errors, 'password')}
                                type="password" />
                            <Button
                                disabled={loading}
                                color="orange"
                                fluid size="large"
                                onClick={this.handleSubmit}
                                className={loading ? 'loading' : ''}>Submit</Button>
                        </Segment>
                    </Form>
                    {
                        errors.length > 0 &&
                        (<Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>)
                    }
                    <Message>
                        Already a user ?
                        <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register
