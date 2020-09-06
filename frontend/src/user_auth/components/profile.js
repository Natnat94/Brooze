import React from 'react';
import { postData, getData } from '../../map/ApiDataFunc'

var style = {
    backgroundColor: 'aqua',
    padding: '0px'
}
var borderstyle = {
    border: "aqua",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "50%",
}

class Profile extends React.Component {
    /* this component manage the user profile part */
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        //Connect to the api backend to get the GeoJSON Object.
        getData(this.props.mainurl + '/auth/profil/', this.props.token)
            .then(data => this.setState(data))
            .catch(error => console.error('Error: \n' + error.detail))
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }


    mySubmitHandler = (event) => {
        event.preventDefault();
        console.table(this.state);
        postData(this.props.mainurl + '/auth/profil/', this.state, this.props.token)
            .then(this.valideResponse)
            .catch(this.logError);
    }
    render() {
        return (
            <div className="wrapper fadeInDown" style={style}>
                <div id="formContent" className='container mb-5s' style={{ width: "100%" }}>

                    <form onSubmit={this.mySubmitHandler}>
                        <h3> Update your profile </h3>
                        {/* <p>Update your profile </p> */}
                        {/* TODO: need to be able to upload a profile picture */}
                        <img src={require('./icon3.png')} className="fadeIn first" id="icon" alt="User Icon" style={borderstyle} /> <br /><br />
                        <input type="button" id="change_password" className="fadeIn second" value="Change password" />
                        <input type="text" id="fname" className="fadeIn second" defaultValue={this.state.first_name} name='first_name' onChange={this.myChangeHandler} autoComplete="fname" placeholder="First name" />
                        <input type="text" id="lname" className="fadeIn third" defaultValue={this.state.last_name} name='last_name' onChange={this.myChangeHandler} autoComplete="lname" placeholder="Last name" />
                        <br />
                        <input type="radio" name="gender" className="fadeIn third" checked={this.state.gender === "male"} onChange={this.myChangeHandler} value="male" />	&nbsp;
                        <label className="fadeIn third" htmlFor="male">Male</label> 	&nbsp;	&nbsp;	&nbsp;
                        <input type="radio" name="gender" className="fadeIn third" checked={this.state.gender === "female"} onChange={this.myChangeHandler} value="female" />	&nbsp;
                        <label className="fadeIn third" htmlFor="male">Female</label><br />
                        {/* <label htmlFor="phone">Phone number:</label><br /> */}
                        <input type="tel" id="phone" name="phone" className="fadeIn third" defaultValue={this.state.phone} onChange={this.myChangeHandler} placeholder="Phone ex: '0698765432'" pattern="[0][6-7][0-9]{8}" /><br />
                        {/* <label for="email">Email:</label> */}
                        <input type="email" id="email" name="email" className="fadeIn third" defaultValue={this.state.username} onChange={this.myChangeHandler} placeholder="Email" readOnly />
                        <input type="submit" className="fadeIn fourth" value="Save" />

                    </form>
                </div>
            </div>
        )
    }
}


export default Profile;