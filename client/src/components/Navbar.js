import React, { Fragment, useContext, useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { 
    HStack, 
    Heading,
    Text,
    Spacer,
    Button,
    Image,
    Box,
    Flex
} from '@chakra-ui/react'

import AuthContext from '../store/auth'
import imgurl from '../resources/img/keyboard.png'
import acmlogo from '../resources/img/acmlogo.png'
import logoutpng from '../resources/img/logout.png'

const Navbar = () => {
    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;
    const token = authCtx.token;

    const [hasRoom, setHasRoom] = useState(true);

    // useEffect(()=>{
    //     doesHaveRoom()
    // })

    const logout = () => {
        authCtx.logout()
        window.location.reload();
    }

    const login = () => {
        authCtx.login()
    }

    // const doesHaveRoom = () => {
    //     fetch('http://localhost:3000/users/me',
    //             {   
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': 'Bearer '+token,
    //                 }
    //             }
    //         ).then(response => 
    //             response.json().then(data => ({
    //                 data: data,
    //                 status: response.status
    //             })
    //         ).then(res => {
    //             if(res.data){
    //               if (res.data.user.inRoom) {
    //                 setHasRoom(true)
    //               }
    //             } else {
    //                 
    //             }
    //         }))
    //   }
 
    return(
        <Flex 
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
        >
            <Link to="/">
                <Flex 
                    flexDirection="row" 
                    alignItems="center"
                    justifyContent="center">
                    <Image 
                    boxSize={["25px", "35px", "50px", "50px", "50px"]}
                    src={imgurl} 
                    mr={["2px", "8px", "8px", "8px", "8px"]}
                    />
                    <Heading 
                    fontSize={["20px", "24px", "32px", "32px", "32px"]}
                    mr={["20px", "24px", "32px", "32px", "32px"]}
                    color="liteblue">litecode</Heading>
                </Flex>
            </Link>

            <Spacer />

            

            {isLoggedIn ? 
            <Fragment>
                {hasRoom? 
                <NavLink activeClassName="activeLink" to="/room">
                    <Text
                        fontSize={["16px", "18px", "22px", "22px", "22px"]}
                        color="litegrey.400"
                        fontWeight="medium"
                        marginRight={["10px", "10px", "25px", "25px", "25px"]}
                    >My Room</Text>
                </NavLink>:null}

                <NavLink activeClassName="activeLink" to="/allrooms">
                    <Text
                        fontSize={["16px", "18px", "22px", "22px", "22px"]}
                        color="litegrey.400"
                        fontWeight="medium"
                        marginRight={["2px", "10px", "25px", "25px", "25px"]}
                    >All Rooms</Text>
                </NavLink>

                <Image 
                    boxSize={["35px", "35px", "40px", "40px", "40px"]}
                    objectFit="cover"
                    src={logoutpng}
                    cursor="pointer"
                    padding="6px"
                    opacity="0.2"
                    onClick={logout}
                />
            </Fragment> :
            <Image 
                height={["30px", "30px", "40px", "40px", "40px"]}
                objectFit="cover"
                src={acmlogo}
            />}
        </Flex>
    )
}

export default Navbar;