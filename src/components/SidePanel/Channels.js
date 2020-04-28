import React, { Component } from 'react'
import { Menu, Icon, Modal, Form, Input, FormField, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentChannel } from '../../actions'
import firebase from '../../firebase'

class Chanels extends Component {
    state = {
        channelName: '',
        channelDetails: '',
        channels: [],
        modal: false,
        user: this.props.currentUser,
        channelsRef: firebase.database().ref('channels'),
    }

    componentDidMount() {
        this.addListener()
    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    addListener = () => {
        let loadedChannels = []
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val())
            this.setState({ channels: loadedChannels })
        })
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    changeChannel = channel => {
        this.props.setCurrentChannel(channel)
    }

    addChanel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state
        const key = channelsRef.push().key
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelsRef.child(key).update(newChannel).then(() => {
            this.setState({ channelName: '', channelsRef: '' })
            this.closeModal()
        }).catch(error => console.log(error))
    }

    openModal = () => this.setState({ modal: true })
    closeModal = () => this.setState({ modal: false })
    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails

    handleSubmit = event => {
        event.preventDefault()
        if (this.isFormValid(this.state)) {
            this.addChanel()
        }
    }


    render() {
        const { channels, modal } = this.state
        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span>
                            <Icon name='exchange' /> CHANNELS
                    </span>{" "}
                    ({channels.length}) <Icon name='add' onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a chanel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label='Name of Channel'
                                    name='channelName'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input
                                    fluid
                                    label='About the Channel'
                                    name='channelDetails'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='green' inverted onClick={this.handleSubmit}>
                            <Icon name='checkmark' /> Add
                    </Button>

                        <Button color='red' inverted onClick={this.closeModal}>
                            <Icon name='remove' /> Cancel
                    </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(null, {setCurrentChannel})(Chanels)
