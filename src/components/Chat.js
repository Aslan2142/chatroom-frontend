import React from 'react';
import Axios from 'axios';
import { ListGroup, InputGroup, FormControl, Button, Image } from 'react-bootstrap';

import { BackendUrl } from '../AppSettings';

class Chat extends React.Component {

    state = {
        messages: [],
        typingMessage: '',
        attachment: null
    }

    messageTextBox = null;
    lastMessageUuid = '';
    downloadingMessages = false;

    componentDidMount = () => {
        this.downloadMessages();
        setInterval(this.downloadNewMessages, 1000);
    }

    downloadMessages = () => {
        Axios.get(BackendUrl + 'api/v1/message').then(response => {
            this.setState({
                messages: response.data
            });

            if (this.state.messages.length > 0) this.lastMessageUuid = this.state.messages[this.state.messages.length - 1].uuid;
        });
    }

    downloadNewMessages = () => {
        if (this.downloadingMessages) return;
        this.downloadingMessages = true;

        Axios.get(BackendUrl + 'api/v1/message?after=' + this.lastMessageUuid).then(response => {
            if (response.data.length === 0) return;

            let tmpMessages = this.state.messages;
            response.data.forEach(message => {
                tmpMessages.push(message);
            });
            this.setState({
                messages: tmpMessages
            });

            this.lastMessageUuid = this.state.messages[this.state.messages.length - 1].uuid;
            this.downloadingMessages = false;
        }).catch(() => { this.downloadingMessages = false; });
    }

    updateTypingMessage = (newTypingMessage) => {
        this.setState({
            typingMessage: newTypingMessage
        });
    }

    attachFile = (file) => {
        this.setState({
            attachment: file
        });
    }

    detachFile = () => {
        this.setState({
            attachment: null
        });
    }

    sendMessage = () => {
        if (this.state.attachment === null || this.state.attachment === undefined) {
            if (this.state.typingMessage.length < 1) return;
            Axios.post(BackendUrl + 'api/v1/message', { author: this.props.username, text: this.state.typingMessage, file: '' }).then(response => {
                this.setState({
                    typingMessage: ''
                });
            });

            this.messageTextBox.select();
            return;
        }

        let filename = this.state.attachment.name;
        let data = new FormData()
        data.append('file', this.state.attachment)
        Axios.post(BackendUrl + 'api/v1/file/' + filename, data).then(response => {
            Axios.post(BackendUrl + 'api/v1/message', { author: this.props.username, text: this.state.typingMessage, file: filename }).then(response => {
                this.setState({
                    typingMessage: ''
                });
            });
        });

        this.setState({
            attachment: null
        });

        this.messageTextBox.select();
    }

    showFile = (file) => {
        if (file === '' || file === null || file === undefined) return null;

        if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.webp') || file.endsWith('.svg')) {
            return <a target="_blank" rel="noreferrer" href={BackendUrl + 'api/v1/file/' + file}><Image className="mt-2 mb-2" width="480" src={BackendUrl + 'api/v1/file/' + file} rounded /></a>
        } else if (file.endsWith('.mp4') || file.endsWith('.mkv') || file.endsWith('.mov') || file.endsWith('.webm') || file.endsWith('.avi')) {
            return <video width="480" controls src={BackendUrl + 'api/v1/file/' + file} />
        } else {
            return <a target="_blank" rel="noreferrer" href={BackendUrl + 'api/v1/file/' + file}><Button className="mt-2 mb-2" variant="info">Download File</Button></a>;
        }
    }

    messageList = () => {
        return (
            <ListGroup>
                {
                    this.state.messages.map(message => {
                        return (
                            <ListGroup.Item key={message.uuid} className={message.author === this.props.username ? "bg-dark text-muted border-secondary" : "bg-dark text-light border-secondary"}>
                                <span className="font-weight-bold">{message.author}: </span>
                                {message.text}
                                <br />
                                {this.showFile(message.file)}
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
        )
    }

    fileButton = () => {
        if (this.state.attachment === null || this.state.attachment === undefined) {
            return <Button variant="info">Attach File<input style={{ position: 'absolute', opacity: 0, right: 0, top: 0, height: 40 }} type="file" onChange={(e) => { this.attachFile(e.target.files[0]) }} /></Button>
        } else {
            return <Button variant="info" onClick={(e) => { this.detachFile() }}>{this.state.attachment.name.length > 40 ? this.state.attachment.name.substring(0, 38) + '...' : this.state.attachment.name}</Button>
        }
    }

    sendForm = () => {
        return (
            <InputGroup className="mt-3 mb-5">
                <InputGroup.Prepend>
                    { this.fileButton() }
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" ref={messageTextBox => this.messageTextBox = messageTextBox} onChange={(e) => { this.updateTypingMessage(e.target.value); }} onKeyPress={(e) => { if (e.charCode === 13) this.sendMessage(); }} value={this.state.typingMessage} placeholder="Say something..."></FormControl>
                <InputGroup.Append>
                    <Button variant="info" onClick={this.sendMessage} disabled={this.state.typingMessage.length < 1 && (this.state.attachment === null || this.state.attachment === undefined)}>Send Message</Button>
                </InputGroup.Append>
            </InputGroup>
        )
    }

    render() {
        return (
            <div>
                <this.messageList />
                <this.sendForm />
            </div>
        )
    }

}

export default Chat;