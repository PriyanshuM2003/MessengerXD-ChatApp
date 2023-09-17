import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import Axios from "axios";
import {
  Box,
  Button,
  Stack,
  Text,
  Tooltip,
  useToast,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import DeleteChatModal from "./miscellaneous/DeleteChatModal";
import SideDrawer from "./miscellaneous/SideDrawer";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await Axios.get(
        `${process.env.REACT_APP_SERVER}/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await Axios.delete(
        `${process.env.REACT_APP_SERVER}/api/chat/${chatId}`,
        config
      );
      fetchChats();
      window.location.reload();
      toast({
        title: "Chat Deleted",
        description: "Chat deleted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to delete the chat",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();

    const intervalId = setInterval(() => {
      fetchChats();
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line
  }, [fetchAgain]);

  const handleChatSelect = (chat) => {
    setNotification((prevNotifications) =>
      prevNotifications.filter((notif) => notif.chat._id !== chat._id)
    );
    setSelectedChat(chat);
  };

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotification(JSON.parse(storedNotifications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notification));
  }, [notification]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        p="1"
        bg="purple"
        w={{ base: "100%", md: "27%" }}
        borderLeftRadius="md"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          fontSize={{ base: "28px", md: "30px" }}
          px={1}
          pb={1}
          w="100%"
        >
          <Text fontSize="2.5rem" as="b" className="heading">
            Chats
          </Text>
          {/* ********************************************************************************************** */}
          <SideDrawer />
          {/* ********************************************************************************************** */}
        </Box>

        <Box
          p={3}
          bg="gray.100"
          w="100%"
          h="100%"
          borderRadius="sm"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll" scrollBehavior="smooth">
              {chats.map((chat) => (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent={"space-between"}
                  onClick={() => handleChatSelect(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#ded30d" : "gray.300"}
                  color={selectedChat === chat ? "purple" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Box>
                    <Text fontSize="lg" fontWeight="500">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>
                          {chat.latestMessage.sender.name === loggedUser.name
                            ? "You"
                            : chat.latestMessage.sender.name}
                          :
                        </b>{" "}
                        {chat.latestMessage.content.length > 50
                          ? `${chat.latestMessage.content.substring(0, 40)}...`
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                  <Flex alignItems={"center"}>
                    <Box mb={4}>
                      <NotificationBadge
                        count={
                          notification.filter(
                            (notif) => notif.chat._id === chat._id
                          ).length
                        }
                        effect={Effect.SCALE}
                      />
                    </Box>
                    {!chat.isGroupChat && (
                      <Tooltip label="Delete Chat" hasArrow placement="bottom">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatToDelete(chat._id);
                            setIsDeleteModalOpen(true);
                          }}
                          _hover={{
                            color: "red",
                          }}
                        >
                          <Icon as={MdDelete} fontSize="1.3rem" />
                        </Button>
                      </Tooltip>
                    )}
                  </Flex>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
          <DeleteChatModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={() => handleDeleteChat(chatToDelete)}
          />
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
