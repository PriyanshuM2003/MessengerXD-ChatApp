import { AiOutlineClose } from 'react-icons/ai';
import { Badge, Box, Icon } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction, isGroupAdmin, isLoggedInUserGroupAdmin, loggedInUser }) => {
    return (
        <>
            <div>
                <Box
                    px={2}
                    py={1}
                    display='flex'
                    flexDir='row'
                    justifyContent='center'
                    alignItems='center'
                    borderRadius='lg'
                    m={1}
                    mb={2}
                    variant='solid'
                    bg='#29b6cf'
                    color='white'
                    cursor={(isLoggedInUserGroupAdmin && !isGroupAdmin) ? 'pointer' : 'default'}
                    fontWeight='600'
                    fontSize='md'
                    onClick={handleFunction}
                >
                    {loggedInUser._id === user._id ? 'You' : user.name}
                    {!isGroupAdmin && isLoggedInUserGroupAdmin && (
                        <Icon fontSize='2xl' as={AiOutlineClose} pl={1} />
                    )}
                    {isGroupAdmin && (
                        <Badge ml={2} colorScheme='purple'>
                            Admin
                        </Badge>
                    )}
                </Box>
            </div>
        </>
    )
}

export default UserBadgeItem;