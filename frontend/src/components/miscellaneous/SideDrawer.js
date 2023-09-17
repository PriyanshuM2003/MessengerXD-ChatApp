import React, { useRef, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Icon,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { MdGroupAdd } from "react-icons/md";
import Axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

import GroupChatModal from "./GroupChatModal";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const resetSearch = () => {
    setSearch("");
    setSearchResult([]);
  };

  const btnRef = useRef();
  const toast = useToast();

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Plese enter something to search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
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
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const existingIndividualChat = chats.find(
        (chat) =>
          chat.users.length === 2 &&
          chat.users.some((user) => user._id === userId)
      );

      const existingGroupChat = chats.find(
        (chat) =>
          chat.isGroupChat && chat.users.some((user) => user._id === userId)
      );

      if (existingIndividualChat) {
        setSelectedChat(existingIndividualChat);
      } else {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await Axios.post(
          `${process.env.REACT_APP_SERVER}/api/chat`,
          { userId },
          config
        );

        if (existingGroupChat) {
          setSelectedChat(data);
        } else {
          setChats([data, ...chats]);
          setSelectedChat(data);
        }
      }

      setLoadingChat(false);
      onClose();
      resetSearch();
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const isUserInIndividualChats = (userId) => {
    return chats.some(
      (chat) =>
        chat.users.length === 2 &&
        chat.users.some((user) => user._id === userId)
    );
  };

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Box
          className="Icon"
          fontSize="2rem"
          cursor="pointer"
          color="gray.100"
          mr={4}
        >
          <Tooltip
            label="Search Users to chat"
            hasArrow
            placement="bottom-start"
          >
            <i
              className="fa-solid fa-magnifying-glass"
              ref={btnRef}
              onClick={onOpen}
            ></i>
          </Tooltip>
        </Box>

        <GroupChatModal>
          <Tooltip label="Create Group Chat" hasArrow placement="bottom-end">
            <Box
              mr={4}
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
              <Icon as={MdGroupAdd} />
            </Box>
          </Tooltip>
        </GroupChatModal>

        <Menu>
          <Tooltip label="User" hasArrow placement="bottom-end">
            <MenuButton
              border="1px solid white"
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar size={"md"} src={user.pic} />
            </MenuButton>
          </Tooltip>
          <MenuList alignItems={"center"}>
            <ProfileModal user={user}>
              <MenuItem style={{ fontWeight: "500", fontSize: "1rem" }}>
                My Profile
              </MenuItem>
            </ProfileModal>
            <MenuItem
              onClick={logoutHandler}
              style={{ fontWeight: "500", fontSize: "1rem" }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="purple" color="white">
          <DrawerCloseButton />
          <DrawerHeader fontSize="2xl">Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" justifyContent="center">
              <Input
                placeholder="Search by name or email"
                value={search}
                bg="gray.200"
                color="black"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                ml="2"
                onClick={handleSearch}
                colorScheme="yellow"
                fontSize="xl"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </Button>
            </Box>
            <Box mt="2">
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                    inMyChats={isUserInIndividualChats(user._id)}
                  />
                ))
              )}
            </Box>
            {loadingChat && (
              <Spinner size="lg" mx="auto" mt="4" display="flex" />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
