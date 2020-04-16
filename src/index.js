import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import { setUser } from './actions'
import registerServiceWorker from './registerServiceWorker'
import rootReducer from './reducers'
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import firebase from 'firebase'
import { composeWithDevTools } from 'redux-devtools-extension'
import 'semantic-ui-css/semantic.min.css'
import { connect } from 'react-redux'

const store = createStore(rootReducer, composeWithDevTools())

class Root extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.setUser(user)
                this.props.history.push('/')
            }
        })
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={App} />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                </Switch>
            </Router>
        )
    }
}

const RootWithAuth = withRouter(connect(null, { setUser })(Root))

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>,
    document.getElementById('root')
)

registerServiceWorker()
