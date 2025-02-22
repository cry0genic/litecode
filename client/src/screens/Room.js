import React, { Fragment, useEffect, useState, useContext } from 'react'
import AuthContext from '../store/auth.js'
import { useHistory } from 'react-router-dom'
import UserCard from '../components/UserCard.js'
import { 
    Flex, 
    useDisclosure,
    Box, 
    Heading, 
    Text, 
    Button, 
    ButtonGroup,
    Spinner,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
 } from '@chakra-ui/react'
import { DummyData } from '../resources/dummy.js'
import { Redirect, Link } from 'react-router-dom'

const Room = () => {
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [roomDetails, updateRoomDetails] = useState(null)
    const [redirect, setRedirect] = useState(null);

    const authCtx = useContext(AuthContext);
    const token = authCtx.token;

    const history = useHistory();

    useEffect(() => {
        loadRoom()
    }, [redirect])


    const loadRoom = () => {
        fetch('https://litecode.bitsacm.in/server/users/me',
                {   
                    method: 'GET',
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
                // console.log(res.data)
                if(res.data.user.inRoom){
                    setUserInfo(res.data)
                    const roomID = res.data.user.roomID
                    getRoomDetails(roomID);
                } else {
                    updateRedirect()
                }
                if (redirect != null) alert("Please join a room.")
            }))
    }

    const getRoomDetails = (roomID) => {
        fetch('https://litecode.bitsacm.in/server/room/'+roomID,
                {   
                    method: 'GET',
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
                    updateRoomDetails(res.data)
                } else {
                    alert("ERROR POSTING CONTENT.");
                }
            }))
    }

    const lockRoom = () => {
        fetch('https://litecode.bitsacm.in/server/lock',
                {   
                    method: 'PATCH',
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
                    loadRoom();
                } else {
                    alert("ERROR POSTING CONTENT.");
                }
            }))
    }

    const leaveRoom = () => {
        fetch('https://litecode.bitsacm.in/server/leaveRoom',
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
                    updateRedirect()
                } else {
                    alert("ERROR POSTING CONTENT.");
                }
            }))
    }

    const updateRedirect = () => {
        setRedirect("non-null")
    }

    const { isOpen, onOpen, onClose } = useDisclosure()


    return(
        <Fragment>
        { redirect===null ?
        <Fragment>
            {roomDetails ? 
            <Fragment>
            {roomDetails.room.users.length===1 ?
            <Heading 
                marginLeft="10px" 
                marginTop="40px"
                fontSize="32px"
                color="litegrey.600"
            >🤙 Invite a friend!</Heading> :
            <Heading 
                marginLeft="10px" 
                marginTop="40px"
                fontSize="32px"
                color="litegrey.600"
            >👏 It's a party!</Heading>
            }


        <Flex flexDir={["column", "column", "row", "row", "row"]}>

            <Flex 
                margin="auto" 
                justifyContent="flex-start" 
                alignItems="start"
                flexDirection="row" 
                mt="30px" 
                width={["100%", "100%", "80%", "80%", "80%"]}
                flexWrap="wrap"
            >
                {roomDetails.room.users.map((user, index)=>(
                    <UserCard 
                        name={user.userID.name}
                        id={user.userID._id}
                        imgUrl={user.userID.avatar}
                        phoneNo={user.userID.phoneNo}
                        loadRoom={loadRoom}
                        isAdmin={user.userID._id===roomDetails.room.roomAdmin}
                        userIsAdmin={(roomDetails.room.roomAdmin === userInfo.user._id)}
                    />
                ))}
            </Flex>

        <Box 
            display="flex" 
            flexDir="column" 
            width={["100%", "100%", "20%", "20%", "20%"]} 
            m="0" 
            p="0"
            ml={["10px", "30px", "0px", "0px", "0px"]}
        >
            <Box 
                display="flex" 
                flexDir={["column", "column", "column", "column", "column"]}
                mt={["20px", "20px", "40px", "40px", "40px"]}
                width="100%"
                flexWrap="wrap"
            >
                <Box mb="20px">
                    <Heading
                        fontSize="20px"
                        color="litegrey.400"
                        fontWeight="medium"
                    >Room Name</Heading>
                    <Text
                        fontSize="28px"
                        color="litegrey.600"
                        fontWeight="bold"
                        >{roomDetails.room.roomID}</Text>
                </Box>

                <Box 
                    display="flex" 
                    flexDir={["row", "column", "column", "column", "column"]}
                >
                    <Box mb="20px" mr="40px">
                        <Heading
                            fontSize="20px"
                            color="litegrey.400"
                            fontWeight="medium">Members</Heading>
                        <Text
                            fontSize="28px"
                            fontWeight="bold"
                            color="litegrey.600">{roomDetails.room.users.length} / 4</Text>
                    </Box>

                    <Box mb="20px">
                        <Heading
                            fontSize="20px"
                            color="litegrey.400"
                            fontWeight="medium">Per Member</Heading>
                        <Text
                            fontSize="28px"
                            color="litegrey.600"
                            fontWeight="bold"
                            >₹ {roomDetails.room.costPerMember}</Text>
                    </Box>
                </Box>
            </Box>
            <Box 
                display="flex" 
                flexDir={["row", "column", "column", "column", "column"]}
                width="100%"
                flexWrap="wrap"
            >
                {(roomDetails.room.roomAdmin === userInfo.user._id) 
                ? 
                    <Fragment> 
                        {roomDetails.room.roomLocked ? 
                            <>
                            <Button 
                                bg="liteblue" 
                                width={["120px", "150px", "150px", "150px", "150px"]}
                                mb="10px" 
                                mr="20px"
                                color="white" 
                                onClick={onOpen}
                                _hover={{ bg: "#81C8DC" }}
                                _active={{
                                    bg: "#81C8DC",
                                    transform: "scale(0.98)",
                                    borderColor: "liteblue",
                                }}
                            > 🥳 Let's code</Button> 
                    
                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader color="litegrey.600" fontSize="28px">It's time to start coding.</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Text weight="medium" fontSize="18px" color="litegrey.400">
                                        Hey there, @Admin! This is now your final Litecode group. You should be able to see everyone's mobile numbers — just create a WhatsApp group with all of them, split the bill, make the purchase, and start Litecoding!
                                    </Text>
                                </ModalBody>
                    
                                <ModalFooter>
                                    <Button colorScheme="gray" mr={3} onClick={onClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                                </ModalContent>
                            </Modal>
                            </>
                        : 
                            <ControlledUsageS2 lockRoom={lockRoom}/>
                        }
                        </Fragment>
                :   null}
                    <ControlledUsage count={roomDetails.room.users.length} leaveRoom={leaveRoom} />
            </Box>
        </Box>
            </Flex>
            </Fragment>:<Spinner />}
        </Fragment> : <Redirect to="/allrooms" />}
        </Fragment>
    )
}


const ControlledUsage = (props) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    return (
      <>
        { props.count > 1 ? 
        <Fragment>
            <Button 
                width={["120px", "150px", "150px", "150px", "150px"]}
                mt="0px" 
                onClick={open}
                color="white" 
                bg="#E53E3E" 
                _hover={{ bg: "#EF7474" }}
                _active={{
                    bg: "#EF7474",
                    transform: "scale(0.98)",
                    borderColor: "red",
                }}
            >Leave Group</Button>
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
                Are you sure you want to leave? You won't be able to join more rooms for 2 days.
                </PopoverBody>
                <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                    <Button color="litegrey.400" variant="outline" onClick={close}>Cancel</Button>
                    <Button 
                        onClick={props.leaveRoom} 
                        color="white" 
                        bg="#E53E3E" 
                        _hover={{ bg: "#EF7474" }}
                        _active={{
                            bg: "#EF7474",
                            transform: "scale(0.98)",
                            borderColor: "red",
                        }}
                    >Leave</Button>
                </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
            </Popover>
        </Fragment>
        : 
        <Fragment>
            <Button 
                width={["120px", "150px", "150px", "150px", "150px"]}
                mt="0px" 
                onClick={props.leaveRoom}
                color="white" 
                bg="#E53E3E" 
                _hover={{ bg: "#EF7474" }}
                _active={{
                    bg: "#EF7474",
                    transform: "scale(0.98)",
                    borderColor: "red",
                }}
            >Leave Group</Button>
        </Fragment>
        }
      </>
    )
  }


  const ControlledUsageS2 = (props) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    return (
      <>
        <Fragment>
            <Button 
                width={["120px", "150px", "150px", "150px", "150px"]}
                mr="20px"
                mb="10px" 
                onClick={open}
                bg="liteblue" 
                color="white" 
                _hover={{ bg: "#81C8DC" }}
                _active={{
                    bg: "#81C8DC",
                    transform: "scale(0.98)",
                    borderColor: "liteblue",
                }}
            >Lock Group</Button>
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
                Are you sure you want to lock the room? This will be your final Litecode group.
                </PopoverBody>
                <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                    <Button color="litegrey.400" variant="outline" onClick={close}>Cancel</Button>
                    <Button 
                        onClick={props.lockRoom} 
                        bg="liteblue" 
                        color="white" 
                        _hover={{ bg: "#81C8DC" }}
                        _active={{
                            bg: "#81C8DC",
                            transform: "scale(0.98)",
                            borderColor: "liteblue",
                        }}
                    >Lock Room</Button>
                </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
            </Popover>
        </Fragment>
      </>
    )
  }



export default Room;