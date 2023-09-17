import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  InputRightElement,
  InputGroup,
  Input,
  Icon,
  Stack,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  console.log("server", process.env.REACT_APP_SERVER);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Invalid Credentials",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await Axios.post(
        `${process.env.REACT_APP_SERVER}/api/user/login`,
        { email, password },
        config
      );
      toast({
        title: "Login successful!",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      window.location.reload();
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        spacing={8}
        mx={"auto"}
        w={{ lg: "lg", base: "20rem" }}
        border={"1px"}
        rounded={"lg"}
        borderColor={"yellow.400"}
      >
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                width="full"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? (
                      <Icon fontSize="xl" as={AiFillEye} />
                    ) : (
                      <Icon fontSize="xl" as={AiFillEyeInvisible} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.500"}
                color={"white"}
                mx={"auto"}
                width={"50%"}
                fontWeight={"bold"}
                _hover={{
                  bg: "blue.400",
                }}
                isLoading={loading}
                onClick={submitHandler}
              >
                Log in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default Login;
