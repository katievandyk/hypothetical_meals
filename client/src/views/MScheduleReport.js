import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import MScheduleReportDisplay from '../components/reports/MScheduleReportDisplay';

class MScheduleReport extends Component {
   render() {
     return(
       <div>
         <AppNavbar />
         <MScheduleReportDisplay />
       </div>
     );
   }
}

export default MScheduleReport;
