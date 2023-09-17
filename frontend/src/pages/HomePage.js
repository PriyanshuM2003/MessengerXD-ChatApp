import React, { useEffect } from 'react'
import { Text, Container, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useNavigate } from "react-router-dom";
import Footer from './Footer';

const HomePage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/chats');
    }
  }, [navigate]);

  return (
    <>
      <Container centerContent>
        <Box
          className='header'
          display='flex'
          justifyContent='center'
          alignItems='center'
          margin='1rem 0 1rem 0'
          borderRadius='lg'
          w={'100%'}
        >
          <Text className='heading' fontSize={{ md: '4.2rem', sm:'4rem', base: '3rem' }} as='b'>Messenger XD</Text>
        </Box>
        <Tabs variant='soft-rounded' colorScheme='yellow'>
          <TabList marginBottom='1rem' >
            <Tab color='white' fontWeight='700' fontSize='xl' ml={'1rem'} width={{ lg: '50%', base: '45%' }}>Login</Tab>
            <Tab color='white' fontWeight='700' fontSize='xl' width={{ lg: '50%', base: '45%' }}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      <Footer />
    </>
  )
}

export default HomePage