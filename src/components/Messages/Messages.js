import React, { Component } from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'

class Messages extends Component {
    state = {
        privateMessageRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        privateChannel: this.props.isPrivateChannel,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
    }

    componentDidMount() {
        const { channel, user } = this.state

        if (channel && user) {
            this.addListeners(channel.id)
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId)
    }

    addMessageListener = channelId => {
        let loadedMessages = []
        const ref = this.getMessagesRef()

        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val())
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })

            this.countUniqueUsers(loadedMessages)
        })
    }

    countUniqueUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name))
                acc.push(message.user.name)
            return acc
        }, [])

        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0

        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`
        this.setState({ numUniqueUsers })
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }

    handleSearchMessages = () => {
        const channelMessage = [...this.state.messages]
        const regex = new RegExp(this.state.searchTerm, 'gi')
        const searchResults = channelMessage.reduce((acc, message) => {
            if (message.content && message.content.match(regex))
                acc.push(message)
            return acc
        }, [])

        this.setState({ searchResults })
    }

    getMessagesRef = () => {
        const { privateChannel, messagesRef, privateMessageRef } = this.state
        return privateChannel ? privateMessageRef : messagesRef
    }

    displayMessages = messages =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''
    }

    render() {
        const { messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults, privateChannel } = this.state

        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    isPrivateChannel={privateChannel}
                />

                <Segment>
                    <Comment.Group className='messages'>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        )
    }
}

export default Messages
