import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import ChatBox from '../components/ChatBox';
import MyChats from '../components/MyChats';
import { ChatState } from '../Context/ChatProvider';

const ChatPage = () => {

    const { user } = ChatState();

    const [fetchAgain, setFetchAgain] = useState(false)

    return (
        <>
            <div>
                <Box
                    display='flex'
                    justifyContent='space-between'
                    width='100%'
                    height="100vh"
                    padding='0.2rem'
                >
                    {user && (<MyChats fetchAgain={fetchAgain} />)}
                    {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
                </Box>
            </div>
        </>
    )
}

export default ChatPage