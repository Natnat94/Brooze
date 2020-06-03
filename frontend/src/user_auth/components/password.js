import React from 'react';
import {postData} from '../../map/ApiDataFunc'

class PasswordChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            password1: '',
            password2: '',
            errormessage: '',
        };
    }


    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        let err = '';
        if (nam === "new_password2") {
            if (val !== this.state.password1) {
                err = <p>
                <span id="isa_error">
                    This is a warning alert—check it out!</span></p>;
            }
        }
        this.setState({ errormessage: err });
        this.setState({[nam]: val });
    }
    mySubmitHandler = (event) => {
        event.preventDefault();
        if (this.state.password1 !== this.state.password2) {}
        else {
        alert("You are submitting " + this.state.password1);
        let data = {
            old_password: this.state.password, 
            new_password1: this.state.password1, 
            new_password2: this.state.password2,}
        this.sendLogin(data,"Token 8d3082a2926981efba07836f7c96ac3008d4ea58");}
    }

    async sendLogin(data, token) {
        await postData(this.props.mainurl + '/auth/password/', data, token)
          .then(data => {
            console.log(data)
            this.setState({data})
            return data; // JSON data parsed by `response.json()` call
          })
          .then(console.log("le mot de passe est a jour"));
      }

    render() {
        return (
            <>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div className="fadeIn first">
                            <img src={require('./icon3.png')} id="icon" alt="User Icon" />
                        </div>
                        <form onSubmit={this.mySubmitHandler}>

                            <p>You can change your password here</p>
                            <input type="password" id="old_password" className="fadeIn second" onChange={this.myChangeHandler} name="password" placeholder="Old Password" required />
                            <input type="password" id="new_password1" className="fadeIn third" onChange={this.myChangeHandler} name="password1" placeholder="New Oassword" required />
                            <input type="password" id="new_password2" className="fadeIn third" onChange={this.myChangeHandler} name="password2" placeholder="New Password" required />
                            {this.state.errormessage}
                            <input type="submit" className="fadeIn fourth" value="Submit" />
                            
                        </form>
                        <div id="formFooter">

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default PasswordChange;