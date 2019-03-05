import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import UsersEntry from '../components/auth/UsersEntry';

class ManageUsers extends Component {
   render() {
       return(
         <div>
           <AppNavbar />
           <div>
             <UsersEntry />
           </div>
         </div>
       );
    }
}

export default ManageUsers;
