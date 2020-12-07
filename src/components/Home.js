import React from 'react';
import SHA256 from 'js-sha256';
import { Container, InputGroup, FormControl, Button, Modal } from 'react-bootstrap';
import { Check2 } from 'react-bootstrap-icons';

import Chat from './Chat';

class Home extends React.Component {

    state = {
        password: '',
        username: '',
        showIncorrectPasswordModal: false,
        chatting: false
    }

    updatePassword = (newPassword) => {
        this.setState({
            password: newPassword
        });
    }

    updateUsername = (newUsername) => {
        this.setState({
            username: newUsername
        });
    }

    startChatting = () => {
        if (SHA256(this.state.password) === '873ac9ffea4dd04fa719e8920cd6938f0c23cd678af330939cff53c3d2855f34') {
            this.setState({
                showIncorrectPasswordModal: false,
                chatting: true
            });
        } else {
            this.setState({
                showIncorrectPasswordModal: true,
                chatting: false
            });
        }
    }

    passwordField = () => {
        return (
            <InputGroup className="top-margin">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">Chatroom Password</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.updatePassword(e.target.value); }} onKeyPress={(e) => { if (e.charCode === 13 && this.state.username.length >= 3) this.startChatting(); }} value={this.state.password} placeholder="Enter Chatroom Password"></FormControl>
            </InputGroup>
        )
    }

    usernameField = () => {
        return (
            <InputGroup className="my-2">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">Username</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.updateUsername(e.target.value); }} onKeyPress={(e) => { if (e.charCode === 13 && this.state.username.length >= 3) this.startChatting(); }} value={this.state.username} placeholder="Enter your Username (at least 3 letters)"></FormControl>
                <InputGroup.Append>
                    <Button variant="info" onClick={this.startChatting} disabled={this.state.username.length < 3}>Start Chatting <Check2 size={22} /></Button>
                </InputGroup.Append>
            </InputGroup>
        )
    }

    incorrectPasswordModal = () => {
        return (
            <Modal show={this.state.showIncorrectPasswordModal} onHide={() => { this.setState({ showIncorrectPasswordModal: false }) }} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Password Incorrect</Modal.Title>
                </Modal.Header>
                <Modal.Body>The password you have entered is not correct!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { this.setState({ showIncorrectPasswordModal: false }) }}>Try Again</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        if (this.state.chatting) {
            return (
                <div>
                    <Container fluid="lg" className="mt-5">
                        <Chat username={this.state.username} />
                    </Container>
                </div>
            )
        } else {
            return (
                <div>
                    <this.incorrectPasswordModal />

                    <Container fluid="lg" className="mt-5">
                        <this.passwordField />
                        <this.usernameField />
                    </Container>
                </div>
            )
        }
    }

}

export default Home;