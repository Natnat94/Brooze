import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import MoodIcon from '@material-ui/icons/Mood';
import InputIcon from '@material-ui/icons/Input';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LaunchIcon from '@material-ui/icons/Launch';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { postData } from '../main/map/ApiDataFunc';

import './navbar.css'

const useStyles = makeStyles({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "#f1f1f1",
    },
});

const logout = (props) => {
    postData(props.mainurl + '/auth/logout/', '', props.token)
        .then(result => {
            props.snackBar(result.message)
            props.logOut()
        }
            )
        .catch(error => {
            props.logOut();
            props.snackBar('Error: \n' + error.detail)
            console.error('Error: \n' + error.detail)
        })
}


export const LabelBottomNavigation = (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState('recents');

    if (props.is_logged) {
        return (
            <BottomNavigation value={value} onChange={(e, newValue) => props.onModeChange(newValue)} className={classes.root} showLabels>
                <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Profile" value="profile" icon={<AccountBoxIcon />} />
                <BottomNavigationAction label="Friends" value="friends" icon={<PeopleAltIcon />} />
                <BottomNavigationAction label="LogOut" value="home" onClick={() => { logout(props) }} icon={<LaunchIcon />} />
            </BottomNavigation>
        );

    }
    return (
        <BottomNavigation value={value} onChange={(e, newValue) => props.onModeChange(newValue)} className={classes.root} showLabels>
            <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Register" value="register" icon={<MoodIcon />} />
            <BottomNavigationAction label="LogIn" value="login" icon={<InputIcon />} />
        </BottomNavigation>
    );
}
