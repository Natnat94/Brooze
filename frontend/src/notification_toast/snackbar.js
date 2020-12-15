import React from 'react';
import './snackbar.css';



class SnackBar extends React.Component {
    myFunction = () => {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        this.props.handler('snackbar', false)
    }
    componentDidUpdate(prevProps, prevState){
        if(this.props.snackbar !== prevProps.snackbar) {
            if (this.props.snackbar) {
                this.myFunction()
            }
        }
    }
    render() {
        return (
            <>
            <div id="snackbar">{this.props.text}</div>
            </>
        );
    }
}

export default SnackBar;