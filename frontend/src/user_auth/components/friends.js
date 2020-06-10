import React from 'react'
import { getData, postData } from '../../map/ApiDataFunc'
import FilteredMultiSelect from 'react-filtered-multiselect'

import 'bootstrap/dist/css/bootstrap.min.css'

let mainurl

if (process.env.NODE_ENV === 'production') {
    mainurl = 'https://nathan-mimoun.live/api'
} else {
    mainurl = 'http://localhost:8000'
}

const BOOTSTRAP_CLASSES = {
    filter: 'form-control',
    select: 'form-control',
    button: 'btn btn btn-block btn-default',
    buttonActive: 'btn btn btn-block btn-primary',
}

class Friends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedShips: []
        };
    }
    //Get asynchronously the GeoJSON Object, immediately after a component is mounted
    componentDidMount() {
        //Connect to the api backend to get the GeoJSON Object.
        getData(mainurl + '/user/friends_list', this.props.token)
            .then(data => {
                this.setState({ selectedShips: data });
            })
        getData(mainurl + '/user/users_list', this.props.token)
            .then(data => {
                this.setState({ users: data });
            })
    }
    handleDeselect(index) {
        var selectedShips = this.state.selectedShips.slice()
        selectedShips.splice(index, 1)
        this.setState({ selectedShips })
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

    sendUpdate(data, token) {
        postData(mainurl + '/user/friends_list/', data, token)
            .then(data => {
                console.log(data);
            })
            .catch(e => {
                console.log(e)
            })

    }

    render() {
        let friends 
        this.state.users ?  friends = this.state.users :  friends = []
        var { selectedShips } = this.state
        return (
            <>
                <div className="wrapper fadeInDown">
                    <div id="formContent" style={{ maxWidth: '80%' }} className='container mb-5s'>
                        <div className="fadeIn first" style={{ margin: '5px', }}>
                            <h3>Select your friends here:</h3>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <FilteredMultiSelect
                                    classNames={BOOTSTRAP_CLASSES}
                                    onChange={this.handleSelectionChange}
                                    options={friends}
                                    selectedOptions={selectedShips}
                                    textProp="username"
                                    valueProp="id"
                                />
                            </div>
                            <div className="col-md-6">
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