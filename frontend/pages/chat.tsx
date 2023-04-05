import React from "react";
// import styles from './chat.module.css'
import { supabase as client } from './api/supabase-client';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import Stack from '@mui/material/Stack';

import Navbar from '../components/navbar';

const collection_name = 'messagesv1';

class Message{
    text: string;
    sender: string;
    constructor(t: string = '', s: string) {
        this.text = t;
        this.sender = s;
    }

}

async function write_record(text: string, recipient: string, sender: string){
        const {data, error} = await client
        .from(collection_name)
        .insert([{
          recipient: recipient,
          sender: sender,
          text: text
        }]).select()
}


async function get_records(user: string, other_user: string, ascending: boolean = true) {
    // user is a number, may change with objectid change

    const query_string = `and(sender.eq.${user},recipient.eq.${other_user}),and(sender.eq.${other_user},recipient.eq.${user})`;

    const {data, error} = await client
    .from(collection_name)
    .select('sender, text, sent_at')
    .or(query_string)
    .order('sent_at', {ascending: ascending})

    return data

}

class Chat extends React.Component<{sender: string, recipient: string}, {value: string, messages: Message[]}> {
    constructor(props: any) {
        super(props)
        this.state = {value: 'Enter your message here', messages: []}

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        var that = this


        get_records(props.sender, props.recipient).then(function(data) {
           const texts = data?.map((d: { text: string | undefined; sender: string; }) => new Message(d.text, d.sender)) // watch this line, remove type from 'd' if issues arise
           if (texts != undefined) {
            that.setState({ messages: texts}) 
           }
           
        })

        const channel = client.channel('table-db-changes').on('postgres_changes', {
            event: 'INSERT', 
            schema: 'public',
            table: 'messagesv1',
        }, (payload) => {

            if (payload.new.sender === props.recipient && payload.new.sender === props.recipient) { /* Backwards since it's coming in from the POV of the other guy */
                const msg = new Message(payload.new.text, payload.new.sender);

                that.setState({messages: [...that.state.messages, msg]});
            }
        }).subscribe();
    }
    handleChange(event: any) {
        this.setState({value: event.target.value})
    }

    handleSubmit(event: any) {

        console.log('You\'ve submitted');

        this.setState({messages: [...this.state.messages, new Message(this.state.value, this.props.sender)], value: '' }) // clears text box value on submit
        
        write_record(this.state.value, this.props.recipient, this.props.sender);
        
        
        event.preventDefault();
    }

    render() {
        let i = 0;
        return(
        <Box sx={{height: '80vh'}}>
            <form onSubmit={this.handleSubmit}>
                <List>
                    {this.state.messages.map(m => (<ListItem key={i++} sx={{backgroundColor: m.sender === this.props.sender ? '#856084' : '#5C5D67', borderRadius:'25px', padding: '10px', width: '35vw', position: 'relative', left: m.sender === this.props.sender ? '65%' : '0', textAlign: 'left', margin: '5px'}}>{m.text}</ListItem>))}
                    </List>   
            {/* <ul> {this.state.messages.map(m => (<li className={this.props.sender === m.sender ? 'right' : 'left'}>{`${m.text}`}</li>))}
            </ul> */}
        
        
            <TextField sx={{input: {color: 'black', background: '#94a3b8', width:'100vw', position: 'fixed', bottom: '0',}}} id='outlined-controlled' size='small' variant='filled' value={this.state.value} onChange={this.handleChange}/>
            </form>
        
        </Box>
        )
    }

}

export default function Messages({senderId, recipientId}: {senderId: string, recipientId: string}) {

    if (window !== undefined){
        const params = new URLSearchParams(window.location.search);

        const sender = params.get(
            "sender"
        )!;
        const recipient = params.get("recipient")!;

    return (
        <>
        <Stack>
    <Navbar/>    
    <Chat sender={sender} recipient={recipient}></Chat>
    </Stack>
    </>
    )
    }
    return (
        <>
        <Stack>
        <Navbar/>
        <Box>Chat is not available, please return to Posts page</Box>
        </Stack>
        </>
    )
  }

