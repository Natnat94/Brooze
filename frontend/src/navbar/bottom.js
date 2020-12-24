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
import { postData } from '../main/map/ApiDataFunc'

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
    // eslint-disable-next-line
    postData(props.mainurl + '/auth/logout/', '', props.token)
        .then(result => 
            // valideResponse(props, result)
            props.logOut()
            )
        .catch(error => {
            props.logOut();
            console.error('Error: \n' + error.detail)
            // logError(props, error)
        })
}

    // eslint-disable-next-line
const valideResponse = (props, json) => {
    props.logOut();
    props.handler('snackbar_text', json.message);
    props.handler('snackbar', true);

}
    // eslint-disable-next-line
const logError = (props, error) => {
    // Do stuff with the error
    props.logOut();
    console.error('Error: \n' + error.detail)
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
