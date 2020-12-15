import React from 'react'
import { getData, postData } from '../../../main/map/ApiDataFunc'

import face from '../../map/beer.ico'
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './friends.css'


class RemoveFriends extends React.Component {
    /* this component manage the list of friends
    part it display the current friends of the user 
    among the list of all users in the system and can
    update the user's friends list */
    constructor(props) {
        super(props);
        this.state = {
            friends_list: [],
            searchQuery: ""
        };
    }

    //Get asynchronously the data Object, immediately after a component is mounted
    componentDidMount() {
        //Connect to the api backend to get the list of friends Object.
        getData(this.props.mainurl + '/user/friends_list/', this.props.token)
            .then(data => this.setState({ users: data }))
            .catch(error => console.error('Error: \n' + error.detail))
    }

    componentDidUpdate(prevProps, prevState) {
        // Typical usage (don't forget to compare props):
        if (this.state.searchQuery !== prevState.searchQuery) {
            console.log('query state did changed')
            // TODO: doit pouvoir filter les noms de la liste
        }
        if (this.state.friends_list !== prevState.friends_list) {

            getData(this.props.mainurl + '/user/friends_list/', this.props.token)
                .then(data => this.setState({ users: data }))
                .catch(error => console.error('Error: \n' + error.detail))
        }
    }

    sendUpdate(data, token) {
        // send and AJAX POST request to update the 
        // friends list pass as 'data'
        postData(this.props.mainurl + '/user/remove_friend/', data, token)
            .then(this.valideResponse)
            .then(this.setState({ friends_list: data}))
            .catch(this.logError);
    }

    valideResponse = (json) => {
        // Do stuff with the JSON
        this.props.handler('snackbar_text', json.message)
        this.props.handler('snackbar', true)
    }

    logError = (error) => {
        // Do stuff with the error
        this.setState({ errors: error })
        console.error('Error: \n' + error)
    }

    clickHandler = (item) => {
        // When the function receive a  dict that MUST contain 'id' 
        // of user, transform it to an array of dict and send it to the backend
        
        let data = [item]
        this.sendUpdate(data, this.props.token)
    }

    //Required method to render React elements 
    render() {
        let friends
        this.state.users ? friends = this.state.users : friends = []

        return (
            <div id="formContent" style={{ width: "100%", height: '100%', zIndex: '1999' }} className='container mb-5s'>
                <input onChange={(e) => this.setState({ searchQuery: e.target.value })} type="text" placeholder="Search.."></input>
                <ul className="list-group">
                    {friends.map((item, index) => (
                        <li key={index} className="list-group-item m-0 p-2 ">
                            <div className="d-flex flex-row justify-content-between align-items-center bd-highlight ">
                                <div className="p-1 ">
                                    <img className="face" src={face} alt="Logo" />
                                </div>
                                <div className=" w-100 bd-highlight">
                                    <p className="mb-0">{item.username} </p>
                                    {/* TODO: ^^^^^^^should be user's username or full name */}
                                    <small className="text-muted">
                                        Donec id elit non mi porta.
                                {/* {item.phone} */}
                                    </small>
                                    {/* TODO: ^^^^^^ should be the user phone number or email */}
                                </div>
                                {/* <div className="p-1 flex-shrink-1 bd-highlight">
                                            add friends
                                             </div> */}
                                <small className="text-muted">3 days ago</small>
                                {/* TODO: ^^^^^ will be a 'last active' info later off the delta between the TIMENOW and the "last_login" data from the API */}
                                <div className=" p-1 flex-shrink-1 bd-highlight">
                                    <button type="button" className="btn btn-primary p-1" onClick={() => this.clickHandler(item)}>
                                        Remove friend
                                    </button>
                                    {/* TODO: this button need improvement and change value when the friend request is already sent or accepted */}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>);
    }
}

export default RemoveFriends;