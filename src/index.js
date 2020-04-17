import React, { Component } from 'react'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
import 'semantic-ui-css/semantic.min.css'
import { composeWithDevTools } from 'redux-devtools-extension'
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import { setUser, clearUser } from './actions'
import registerServiceWorker from './registerServiceWorker'
import rootReducer from './reducers'
import Spinner from './Spinner'
const store = createStore(rootReducer, composeWithDevTools())

class Root extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.setUser(user)
                this.props.history.push('/')
            } else {
                this.props.history.push('/login')
                this.props.clearUser()
            }
        })
    }

    render() {
        return this.props.isLoading ? (<Spinner />) : (
            <Switch>
                <Route exact path='/' component={App} />
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
            </Switch>
        )
    }
}

const mapStateFromProps = state => ({
    isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser, clearUser })(Root))

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>,
    document.getElementById('root')
)

registerServiceWorker()
