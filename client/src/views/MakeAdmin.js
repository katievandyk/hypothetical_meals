import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import MakeAdminComponent from '../components/auth/MakeAdminComponent';

class MakeAdmin extends Component {
   render() {
       return(
         <div>
           <AppNavbar />
           <div>
             <MakeAdminComponent />
           </div>
         </div>
       );
    }
}

export default MakeAdmin;
