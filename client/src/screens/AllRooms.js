import React, { Fragment, useEffect, useState, useContext, useRef } from 'react'
import AuthContext from '../store/auth.js'
import { Redirect, Link } from 'react-router-dom'
import { DummyData } from '../resources/dummy.js'

import { 
    Flex, 
    Box, 
    Heading, 
    InputGroup,
    Spinner,
    InputLeftElement,
    Modal, 
    useDisclosure, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    FormControl, 
    FormLabel, 
    Input, 
    ModalFooter, 
    Button, 
    IconButton,
} from '@chakra-ui/react'

import {SearchIcon} from '@chakra-ui/icons'
import RoomCard from '../components/RoomCard.js'


const AllRooms = (props) => {

    const [allRooms, setAllRooms] = useState(null);
    const [newf, setNewf] = useState(null);
    const [redirect, setRedirect] = useState(null);

    const authCtx = useContext(AuthContext);
    const token = authCtx.token;


    useEffect(() => {
        getRooms()
    }, [redirect])

    const getRooms = () => {
        fetch('http://localhost:3000/rooms/',
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
                    console.log(res.data);
                    setAllRooms(res.data)
                } else {
                    alert("ERROR RETRIEVING CONTENT.");
                }
            }))
    }

    const searchRef = useRef();

    const submitFunction = () => {
        const search = searchRef.current.value;

        fetch('http://localhost:3000/rooms/?roomID='+search,
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
                console.log(res.data);
                setAllRooms(res.data)
            } else {
                alert("ERROR RETRIEVING CONTENT.");
            }
        }))
    }

    const updateRedirect = () => {
        setRedirect("pls redirect lol")
    }

    return(
        <Fragment>
        {redirect===null ? 
        <Flex width="100%"  flexDirection="column" justifyContent="center" alignItems="center">
            {allRooms ? 
            <Fragment>

            
            <Box margin="auto" display="flex" flexDirection={["column", "column", "row", "row", "row"]} justifyContent="center" alignItems="center"  width="100%">
            <InputGroup 
                width={["350px", "80%", "40%", "40%", "40%"]}
                height="0px"                
                m="20px"    
                mt="50px"
                mb="70px"
                border="none"
            >

                <Input 
                    ml="5px" 
                    bg="#EDF2F7" 
                    border="none" 
                    color="litegrey.400" 
                    fontWeight="medium" 
                    height="40px" 
                    borderRadius="10" 
                    ref={searchRef}
                    placeholder="Looking for a friend's group?" 
                />

                <IconButton 
                    aria-label="Search database" 
                    onClick={submitFunction} 
                    icon={<SearchIcon color="litegrey.600"/>} 
                    ml="5px" 
                    bg="#EDF2F7" 
                    border="none" 
                    color="litegrey.400" 
                />

            </InputGroup>
            <InitialFocus newf={newf} setRedirect={setRedirect}/>
            </Box>
            
            <Box display="flex" width="100%" margin="auto">
                {allRooms ? 
                <Flex margin="auto" flexDirection="row" justifyContent="center" alignItems="center" flexWrap="wrap" marginTop="10px">
                    {allRooms.map((room, index)=>(
                        <RoomCard updateRedirect={updateRedirect} room={room} />
                    ))}
                </Flex>:null}
            </Box>
            </Fragment>: <Spinner />}
            
        </Flex>: <Redirect to="/room" />}
        </Fragment>
        
    )
}

const InitialFocus = (props) =>  {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const initialRef = React.useRef()
    const nameRef = React.useRef()
    const finalRef = React.useRef()

    const authCtx = useContext(AuthContext);
    const token = authCtx.token;
   

    const submitHandler = (e) => {
        e.preventDefault();

        const name = nameRef.current.value;

        fetch('http://localhost:3000/createRoom?roomName='+name,
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
                    console.log("created")
                    props.setRedirect();
                } else {
                    alert("Authentication failed. Please try again.");
                }
            }))
    }


  
    return (
      <>
        <Button mt="20px" color="white" bg="liteblue" onClick={onOpen}>Create New Room</Button>
  
        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create a new room</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Add a Room Name</FormLabel>
                <Input type="text" ref={nameRef} fontWeight="500" placeholder="Litecode by ACM" />
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button onClick={submitHandler} bg="liteblues" color="liteblue" mr={3}>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

export default AllRooms;