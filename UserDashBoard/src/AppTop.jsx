import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TemporaryDrawer from './Drawer';
import { useNavigate } from 'react-router-dom';
import { userState } from './store/atoms/user';
import { userEmailState } from './store/selectors/userEmail';
import { isUserLoading } from './store/selectors/isUserLoading';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import MenuIcon from '@mui/icons-material/Menu';

function AppTop() {
    const navigate = useNavigate();
    let setUser = useSetRecoilState(userState);
    const userLoading = useRecoilValue(isUserLoading);//getting the state.
    const userEmail = useRecoilValue(userEmailState);//getting the state.
    //setting the state i took this because while logout i have to set the state.
    //isLoading can be used here to avoid the flash instead you will flash of empty.

    if (userLoading) {
        return <div>Loading...</div>;
    }
    if (userEmail) {
        return (<Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ backgroundColor: '#132043' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}

                    >
                        <TemporaryDrawer></TemporaryDrawer>

                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        CourseElite
                    </Typography>
                    <Typography style={{ marginRight: 10 }}>{userEmail}</Typography>
                    <Button style={{
                        backgroundColor: "#132043",
                    }} variant="contained" onClick={() => {
                        localStorage.setItem("token", null);
                        setUser({
                            isLoading: false,
                            userEmail: null
                        })

                        navigate('/')
                    }}>Log Out</Button>
                </Toolbar>
            </AppBar>

        </Box>);
    }
    else {

        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: '#132043' }}>
                    <Toolbar>

                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}

                        >
                           
                        </IconButton>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                            CourseElite
                        </Typography>
                        <Button variant="contained" size='medium' style={{ marginRight: 20, backgroundColor: "#132043" }}
                            onClick={() => {
                                navigate("/signup");
                            }}>Sign Up</Button>
                        <Button style={{
                            backgroundColor: "#132043",
                        }} size='medium' variant="contained" onClick={() => {
                            navigate("/signin");
                        }}>Log In</Button>
                    </Toolbar>

                </AppBar>
            </Box>);
    }
}


export default AppTop;
