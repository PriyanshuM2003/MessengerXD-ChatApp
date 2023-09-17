import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat';
import "./Styles.css";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <>
      <Box display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
        alignItems='center'
        flexDirection='column'
        p={1}
        bg='purple'
        w={{ base: '100%', md: '80%' }}
        borderRightRadius='md'
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

      </Box>
    </>
  )
}

export default ChatBox