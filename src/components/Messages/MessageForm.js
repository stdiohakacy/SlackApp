import React, { Component } from 'react'
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'

class MessageForm extends Component {
    state = {
        message: '',
        loading: false,
        errors: [],
        channel: this.props.currentChannel,
        user: this.props.currentUser
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            content: this.state.message,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        }

        return message
    }

    sendMessage = () => {
        const {messagesRef} = this.props
        const {message, channel} = this.state
        if(message) {
            this.setState({loading: true})
            messagesRef.child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => { 
                    this.setState({loading: false, message: '', errors: [] })
                })
                .catch(error => {
                    console.log(error)
                    this.setState({loading: false, errors: this.state.errors.concat(error)})
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({message: 'Add a message'})
            })
        }
    }

    render() {
        const { errors } = this.state
        return (
            <Segment className='message__form'>
                <Input
                    fluid
                    name='message'
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition='left'
                    placeholder='Write your message'
                    onChange={this.handleChange}
                    className={errors.some(error => error.message.includes('message')) ? 'error' : ''}
                />

                <Button.Group icon widths='2'>
                    <Button
                        color='orange'
                        content='Add reply'
                        labelPosition='left'
                        icon='edit'
                        onClick={this.sendMessage}
                    />
                    <Button
                        color='teal'
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm
