import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import LoginComponent from '../components/auth/LoginComponent';


class Login extends Component {
   render() {
       return(
         <div>
           <AppNavbar />
           <div>
             <LoginComponent />
           </div>
         </div>
       );
    }
}

export default Login;
