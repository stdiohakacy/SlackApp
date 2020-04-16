import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { isEmailValid } from '../../helpers/DataHelper'
import firebase from '../../firebase'

class Login extends Component {
    state = {
        password: '',
        email: '',
        errors: [],
        loading: false
    }

    /**
     * ===========================================
     * ||                 Function              ||
     * ===========================================
     */
    displayErrors = (errors) => errors.map((error, idx) => <p key={idx}>{error.message}</p>)

    isFormValid = ({email, password}) => email && password

    /**
     * ===========================================
     * ||                 Style                 ||
     * ===========================================
     */
    handleInputError = (errors, inputName) => {
        return errors.some(error => {
            console.log(error)
            return error.message.toLowerCase().includes(inputName)
        }) ? 'error' : ''
    }

    /**
     * ===========================================
     * ||                 Event                 ||
     * ===========================================
     */
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => console.log(signedInUser))
                .catch(error => this.setState({
                    errors: this.state.errors.concat(error),
                    loading: false
                }))
        }
    }

    render() {
        const { password, email, errors, loading } = this.state
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }} >
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login Account
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
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
                            <Button
                                disabled={loading}
                                color="violet"
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
                        Don't have an account ?
                        <Link to="/register">Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login
