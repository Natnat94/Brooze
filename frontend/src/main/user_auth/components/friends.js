
import React from 'react'
import { getData, postData } from '../../map/ApiDataFunc'
import FilteredMultiSelect from 'react-filtered-multiselect'


import 'bootstrap/dist/css/bootstrap.min.css'
import './friends.css'

var style = {
    // padding: '0px',
    // height: '100vh'
}

const BOOTSTRAP_CLASSES = {
    filter: 'form-control',
    select: 'form-control',
    button: 'btn btn btn-block btn-default',
    buttonActive: 'btn btn btn-block btn-primary',
}

class Friends extends React.Component {
    /* this component manage the list of friends
    part it display the current friends of the user 
    among the list of all users in the system and can
    update the user's friends list */
    constructor(props) {
        super(props);
        this.state = {
            selectedShips: [],
            searchQuery: ""
        };
    }

    //Get asynchronously the data Object, immediately after a component is mounted
    componentDidMount() {
        //Connect to the api backend to get the list of friends Object.
        getData(this.props.mainurl + '/user/friends_list/', this.props.token)
            .then(data => this.setState({ selectedShips: data }))
            .catch(error => console.error('Error: \n' + error.detail))

        //Connect to the api backend to get the list of users Object.
        getData(this.props.mainurl + '/user/users_list/', this.props.token)
            .then(data => this.setState({ users: data }))
            .catch(error => console.error('Error: \n' + error.detail))
    }
    handleDeselect(index) {
        var selectedShips = this.state.selectedShips.slice()
        selectedShips.splice(index, 1)
        this.setState({ selectedShips })
    }

    componentDidUpdate(prevProps, prevState) {
        // Typical usage (don't forget to compare props):
        if (this.state.searchQuery !== prevState.searchQuery) {
            console.log('query state did changed')
            getData(this.props.mainurl + '/user/users_list/' + this.state.searchQuery, this.props.token)
                .then(data => this.setState({ users: data }))
                .catch(error => console.error('Error: \n' + error.detail))
        }
    }

    handleSelectionChange = (selectedShips) => {
        this.setState({ selectedShips })
    }
    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }
    mySubmitHandler = (event) => {
        event.preventDefault();
        this.sendLogin(this.state, "")
    }

    clickHandler = (item) => {   //<------------------------------------------------------------------ this one is in use right now
        // When the function receive a  dict that MUST contain 'id' 
        // of user, transform it to an array of dict and send it to the backend

        let data = [item]
        this.sendUpdate(data, this.props.token)
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


    sendUpdate(data, token) {   
    // send and AJAX POST request to update the 
    // friends list pass as 'data'
        postData(this.props.mainurl + '/user/friends_list/', data, token)
            .then(this.valideResponse)
            .catch(this.logError);
    }
    
    //Required method to render React elements 
    render() {
        let friends
        this.state.users ? friends = this.state.users : friends = []
        var { selectedShips } = this.state
        return (
            <>
                <div className="wrapper fadeInDown" style={style}>
                <div id="formContent" style={{ width: "100%", height: '100%' }} className='container mb-5s'>
                    <div id='formHeader'>
                        <span className="closebtn" onClick={() => this.props.handler('mode', "home")}>&times;</span>
                    </div>
                    <div className="fadeIn first" style={{ margin: '5px', }}>
                        <h3>Select your friends here:</h3>
                    </div>
                    <div>
                        <input type="text" placeholder="Search.."name="searchQuery" onChange={this.myChangeHandler} />
                        </div>
                    <div className="row">
                            <div className="col-6">
                                <FilteredMultiSelect
                                    classNames={BOOTSTRAP_CLASSES}
                                    onChange={this.handleSelectionChange}
                                    options={friends}
                                    selectedOptions={selectedShips}
                                    textProp="username"
                                    valueProp="id"
                                />
                            </div>
                            <div className="col-6">
                                {selectedShips.length === 0 && <p>(nothing selected yet)</p>}
                                {selectedShips.length > 0 && <ol>
                                    {selectedShips.map((ship, i) => <li key={ship.id}>
                                        {`${ship.username} `}
                                        <span style={{ cursor: 'pointer' }} onClick={() => this.handleDeselect(i)}>
                                            &times;
                                        </span>
                                    </li>)}
                                </ol>}
                            </div>
                        </div>

                    <div id="formFooter" style={{ padding: 0 }}>
                            <input type="submit" style={{ margin: '5px' }} onClick={() => this.sendUpdate(this.state.selectedShips, this.props.token)} className="fadeIn fourth" value="Update" />
                        </div>
                </div>
                </div>
            </>
        );
    }
}

export default Friends;