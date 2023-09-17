import { MdGroup } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useToast,
  Box,
  Icon,
  FormControl,
  Input,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import Axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await Axios.put(
        `${process.env.REACT_APP_SERVER}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Failed to create the Group Chat",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await Axios.get(
        `${process.env.REACT_APP_SERVER}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (userA) => {
    if (selectedChat.users.find((u) => u._id === userA._id)) {
      toast({
        title: "User Already exist in the group!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await Axios.put(
        `${process.env.REACT_APP_SERVER}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userA._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleRemove = async (userR) => {
    if (selectedChat.groupAdmin._id !== user._id && userR._id !== user._id) {
      toast({
        title: "Only admin can remove or add someone!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await Axios.put(
        `${process.env.REACT_APP_SERVER}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userR._id,
        },
        config
      );

      userR._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip label="Group Details" hasArrow placement="bottom-end">
        <Box
          onClick={onOpen}
          mr={2}
          cursor="pointer"
          _hover={{
            background: "#ded30d",
          }}
          bg="gray.100"
          rounded="full"
          width="3rem"
          height="3rem"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={MdGroup} fontSize={"2.5rem"} />
        </Box>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="5xl"
            as="b"
            color="purple"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton color="red" fontSize="lg" />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={
                    u._id === user._id ? undefined : () => handleRemove(u)
                  }
                  isGroupAdmin={u._id === selectedChat.groupAdmin._id}
                  isLoggedInUserGroupAdmin={
                    user._id === selectedChat.groupAdmin._id
                  }
                  loggedInUser={user}
                />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Update group chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Tooltip
                label="Update Group Name"
                hasArrow
                placement="bottom-end"
              >
                <IconButton
                  fontSize="2xl"
                  variant="solid"
                  colorScheme="teal"
                  ml="1"
                  isLoading={renameLoading}
                  onClick={handleRename}
                  icon={<Icon as={IoMdCheckmarkCircleOutline} />}
                />
              </Tooltip>
            </FormControl>
            <FormControl display="flex">
              {selectedChat.groupAdmin._id === user._id && (
                <Input
                  placeholder="Add user to group"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              )}
            </FormControl>
            {loading ? (
              <Spinner size="lg" mx="auto" mt="4" display="flex" />
            ) : (
              selectedChat.groupAdmin._id === user._id &&
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
