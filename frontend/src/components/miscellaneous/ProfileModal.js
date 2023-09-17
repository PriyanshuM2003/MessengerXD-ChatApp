import { FaUser } from 'react-icons/fa';
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Image,
    Icon,
    Text,
    Tooltip,
    Box,
} from '@chakra-ui/react';
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? (<span onClick={onOpen}>{children}</span>) : (
                    <Tooltip label="Receiver Profile" hasArrow placement='bottom-end'>
                        <Box onClick={onOpen} mr={2} cursor='pointer' _hover={{
                            background: '#ded30d',
                        }} bg='gray.100' rounded='full' width='3rem' height='3rem' display='flex' alignItems='center' justifyContent='center'>
                            <Icon as={FaUser} fontSize={'2rem'} />
                        </Box>
                    </Tooltip>
                )
            }

            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display='flex' justifyContent='center' fontSize='5xl' as='b' >{user.name}</ModalHeader>
                    <ModalCloseButton color='red' fontSize='lg' />
                    <ModalBody display='flex' mb={4} flexDirection='column' alignItems='center' justifyContent='center'>
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text mt={1} fontSize={{ base: '1rem', md: '1.7rem' }}>
                            {user.email}
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal