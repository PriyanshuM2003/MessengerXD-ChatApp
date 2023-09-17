import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react';

const DeleteChatModal = ({ isOpen, onClose, onDelete }) => {
    const [isLoading, setIsLoading] = useState(false);

    const onDeleteClick = async () => {
        setIsLoading(true);
        await onDelete();
        setIsLoading(false);
        onClose();
    };

    return (
        <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Chat
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to delete this chat? This action cannot be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose} mr={3}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={onDeleteClick} isLoading={isLoading}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default DeleteChatModal;