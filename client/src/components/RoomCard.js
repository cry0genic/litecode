import React, { Fragment, useEffect, useState, useContext } from 'react'
import AuthContext from '../store/auth.js'

import {
    Heading,
    Text,
    Image,
    Flex,
    Box,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    ButtonGroup,
} from '@chakra-ui/react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from "@chakra-ui/react"

  import { useDisclosure } from "@chakra-ui/react"

  import UserCardSm from './UserCardSm'

const RoomCard = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const roomId = props.room.roomID;

    const authCtx = useContext(AuthContext);
    const token = authCtx.token;

    const joinRoom = () => {
        fetch('https://litecode.bitsacm.in/server/joinRoom/'+roomId,
                {   
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+token,
                    }
                }
            ).then(response => 
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
                if(res.data){
                    console.log("do u see me")
                    props.updateRedirect();
                    
                } else {
                    alert("ERROR POSTING CONTENT.");
                }
            }))
    }

    return(
        <Fragment>
            <Flex 
                flexDirection="column" 
                padding="30px" 
                margin={["0px", "0px", "10px", "10px", "10px"]}
                mb={["10px", "10px", "0px", "0px", "0px"]}
                bg="litegrey.20" 
                width={["100%", "350px", "350px", "370px", "370px"]}
                borderRadius="10px"

            >
                <Flex 
                    width="100%">
                <Heading
                    fontSize="28px"
                    color="litegrey.600"
                    isTruncated
                >{props.room.roomID}</Heading></Flex>
                {props.room.users ? 
                <Box margin="0px">
                    <Flex flexDirection="row">
                        {props.room.users.map((user, id) => (
                            <Image 
                                src={user.userID.avatar} 
                                boxSize="20px" 
                                mr="5px" 
                                mt="5px"
                                mb="10px"
                                border="2px" 
                                borderColor="liteblue" 
                                borderRadius="100%" 
                            />
                        ))}
                    </Flex>
                </Box>:null}
                <Text
                 fontSize="18px"
                 fontWeight="medium"
                 color="litegrey.400"
                >You’ll need to pay ₹{props.room.toPay} if you join</Text>
                <Button
                    width="80px"
                    mt="20px"
                    bg="liteblues"
                    color="liteblue"
                    onClick={onOpen}
                    _hover={{ bg: "#E4F9FF" }}
                    _active={{
                        bg: "#E4F9FF",
                        transform: "scale(0.98)",
                        borderColor: "liteblue",
                    }}
                >Join</Button>

                <Modal isOpen={isOpen} size="xl" onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader
                            mt="10px"
                            fontSize="28px"
                            color="litegrey.600"
                        >{props.room.roomID}</ModalHeader>
                        <ModalCloseButton />
                        {props.room.users ?
                        <ModalBody>
                            <Text 
                                mt="-25px"
                                fontSize="20px"
                                fontWeight="medium"
                                color="litegrey.400"
                            >There’s {props.room.users.length} members here</Text>
                            <Flex 
                            flexDirection={["column", "column", "row", "row", "row"]}
                            mt="20px" 
                            justifyContent="space-between"
                            >
                                <Flex flexDirection="column" width="60%">
                                    {(props.room.users.map((user, id) => (
                                        <UserCardSm user={user.userID} />
                                    )))}
                                </Flex>
                                <Flex flexDirection="column" width="40%" mt="30px">
                                <Text
                                fontSize="25px"
                                color="litegrey.400"
                                fontWeight="medium"
                                >You Pay</Text>
                                <Heading
                                mt="-5px"
                                fontSize="34px"
                                color="litegrey.600"
                                mb="30px"
                                >₹ {props.room.toPay}</Heading>
                                <ControlledUsage userRoom={props.userRoom} isBanned={props.isBanned} joinRoom={joinRoom} />

                                {(props.userRoom) ? 
                                <Fragment>
                                    {props.userRoom === props.room.roomID ? 
                                    <Text 
                                        fontSize="14px"
                                        color="litegrey.400"
                                        fontWeight="medium"
                                        mt="-15px"
                                        mb="25px"
                                    >You're already in this room!</Text>
                                    :
                                    <Text 
                                        fontSize="14px"
                                        color="litegrey.400"
                                        fontWeight="medium"
                                        mt="-15px"
                                        mb="25px"
                                    >You're already in another room!</Text>
                                    }
                                </Fragment> : null }
                                {(props.isBanned) ? 
                                    <Text 
                                    fontSize="14px"
                                    color="litegrey.400"
                                    fontWeight="medium"
                                    mt="-15px"
                                    mb="25px"
                                >You've been banned for 48 hours.</Text>
                                : null}
                                
                                
                                </Flex>
                            </Flex>
                        </ModalBody>:null}
                    </ModalContent>
                </Modal>
            </Flex>
           
        </Fragment>
    )
}



const ControlledUsage = (props) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    return (
      <>
        <Fragment>
            <Button 
            bg="liteblue" 
            width="150px" 
            borderRadius="10" 
            mb="20px" 
            color="white" 
            isDisabled={(props.userRoom || props.isBanned)}
            _hover={{ bg: "#81C8DC" }}
            _active={{
                bg: "#81C8DC",
                transform: "scale(0.98)",
                borderColor: "liteblue",
            }}
            onClick={open}>
                Join Group
                </Button> 
            <Popover
                returnFocusOnClose={false}
                isOpen={isOpen}
                onClose={close}
                placement="right"
                closeOnBlur={false}
            >
            <PopoverContent>
                <PopoverHeader fontWeight="semibold" color="litegrey.600">Confirmation</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody color="litegrey.400">
                    Are you sure you want to join this room? If you leave this room after joining, you will be banned for 48 hours.
                </PopoverBody>
                <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                    <Button color="litegrey.400" variant="outline" onClick={close}>Cancel</Button>
                    <Button 
                        onClick={props.joinRoom} 
                        color="white" 
                        bg="liteblue" 
                        _hover={{ bg: "liteblues" }}
                        _active={{
                            bg: "liteblue",
                            transform: "scale(0.98)",
                            borderColor: "liteblues",
                        }}
                    >Join Room</Button>
                </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
            </Popover>
        </Fragment>
      </>
    )
  }

export default RoomCard;