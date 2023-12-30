import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home'
import AddBoxIcon from '@mui/icons-material/AddBox';
import PageviewIcon from '@mui/icons-material/Pageview';
import MenuIcon from '@mui/icons-material/Menu';
import { Navigate, useNavigate } from 'react-router-dom';
export default function TemporaryDrawer() {
    const navigate = useNavigate();
    const [state, setState] = React.useState({
        top: false,

    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const getIconForAnchor = (anchor) => {
        switch (anchor) {
            case 'left':
                return <MenuIcon />;

            default:
                return null;
        }
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {['Home', 'Purchased', 'All Courses'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={
                            () => {
                                let textCopy = text;
                                if (text == 'Purchased')
                                    textCopy = 'purchasedCourse'
                                else if (text == 'Home')
                                    textCopy = ''
                                else if (text == 'All Courses')
                                    textCopy = 'Courses'
                                navigate('/' + textCopy);
                            }
                        } >
                            <ListItemIcon>
                                {index === 0 ? <HomeIcon></HomeIcon> : <></>}
                                {index === 1 ? <AddBoxIcon></AddBoxIcon> : <></>}
                                {index === 2 ? <PageviewIcon></PageviewIcon> : <></>}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>


        </Box>
    );

    return (
        <div>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    {/* Use getIconForAnchor function to get the icon */}
                    <div onClick={toggleDrawer(anchor, true)}>
                        {getIconForAnchor(anchor)}
                    </div>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
