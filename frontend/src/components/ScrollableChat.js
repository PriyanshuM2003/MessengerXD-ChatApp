import React from 'react';
import { Avatar, Box, Tooltip } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleString('en-US', options);
};

const formatTime = (date) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString('en-US', options);
};

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    let lastDate = null;

    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => {
                const currentDate = formatDate(new Date(m.createdAt));
                const showDate = lastDate !== currentDate;
                lastDate = currentDate;
                return (
                    <Box key={m._id} textAlign="left" my={showDate ? '1rem' : '0'}>
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            {showDate && (
                                <span style={{ backgroundColor: 'gray', color: 'white', padding: '0.25rem 1rem', borderRadius: '0.5rem' }}>
                                    {currentDate}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }} key={m._id} >
                            {(isSameSender(messages, m, i, user._id)
                                || isLastMessage(messages, i, user._id)
                            ) && (
                                    <Tooltip label={m.sender.name} placement="bottom-start" hasArrow >
                                        <Avatar
                                            mt='7px'
                                            mr={1}
                                            size='sm'
                                            cursor='pointer'
                                            name={m.sender.name}
                                            src={m.sender.pic}
                                        />
                                    </Tooltip>)}
                            <span style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                borderRadius: '20px',
                                padding: '5px 15px',
                                maxWidth: '75%',
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                            }}>
                                {m.content}
                                <span style={{ marginLeft: '5px', color: 'gray', fontSize: '12px' }}>
                                    {formatTime(new Date(m.createdAt))}
                                </span>
                            </span>
                        </div>
                    </Box>
                );
            })}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
