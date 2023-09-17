import React from 'react'
import {
    Box,
    Container,
    Text,
} from '@chakra-ui/react'

const Footer = () => {
    return (
        <>
            <Box
                bg={'purple'}
                color={'white'}
                as="footer"
                mt="auto"
                w={'full'}
            >
                <Container
                    py={'2'}
                    fontWeight={'semibold'}
                    justify={'center'}
                    align={'center'}>
                    <Text>© 2023 MessengerXD. All rights reserved</Text>
                </Container>
            </Box>
        </>
    )
}

export default Footer;