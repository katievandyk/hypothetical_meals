import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import RegisterComponent from '../components/auth/RegisterComponent';

class Register extends Component {
   render() {
       return(
         <div>
           <AppNavbar />
           <div>
             <RegisterComponent />
           </div>
         </div>
       );
    }
}

export default Register;
