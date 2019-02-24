import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import IngDepReport from '../components/reports/IngDepReport';

class MScheduleReport extends Component {
   render() {
     return(
       <div>
         <AppNavbar />
         <IngDepReport />
       </div>
     );
   }
}

export default MScheduleReport;
