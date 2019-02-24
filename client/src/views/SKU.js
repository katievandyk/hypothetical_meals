import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import SKUAddModal from '../components/skus/SKUAddModal';
import SKUBulkEditMLines from '../components/skus/SKUBulkEditMLines';
import SKUsKeywordSearch from '../components/skus/SKUsKeywordSearch';
import SKUsEntry from '../components/skus/SKUsEntry';
import SKUAlerts from '../components/skus/SKUAlerts';
import IngFilters from '../components/skus/IngFilters';
import PLineFilters from '../components/skus/PLineFilters';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { exportSKUs} from '../actions/exportActions';
import { sortSKUs, groupByPL } from '../actions/skuActions';

import {
  Container, Row, Col, Button,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SKU extends Component {

  state = {
    dropdownOpen: false,
    group_pl: false,
    origLimit: 10
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onNextPage = () => {
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page + 1, this.props.skus.pagelimit, this.props.skus.obj);
  };

  onPrevPage = () => {
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page - 1, this.props.skus.pagelimit, this.props.skus.obj);
  };
  showAll = () => {
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page, -1, this.props.skus.obj);
  }

  haveLimit = () => {
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page, 10, this.props.skus.obj);
  }

  onGBPLClick = () => {
    const boolstr = !this.state.group_pl ? 'True' : 'False';
    this.setState({
      group_pl: !this.state.group_pl
    });
    this.props.groupByPL(boolstr);
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page, this.props.skus.pagelimit, this.props.skus.obj);
  }

   render() {
     var results = 0;
     var results_start = 0;
     var isPrevPage = false;
     var isNextPage = false;
     if(this.props.skus.pagelimit === -1){
       results = this.props.skus.count;
       results_start = 1;
     }
     else{
       results = Math.min(this.props.skus.page * this.props.skus.pagelimit, this.props.skus.count);
       results_start = (this.props.skus.page - 1)*10 + 1;
       isPrevPage = (this.props.skus.page) > 1;
       isNextPage = results < this.props.skus.count;
     }
     const groupByMsg = this.props.skus.obj && this.props.skus.obj.group_pl && this.props.skus.obj.group_pl === "True" ? 'Undo Group by Product Line': 'Group by Product Line';
     return(
       <Provider store={store}>
         <div>
           <div>
             <AppNavbar />
             <SKUAlerts />
           </div>
           <Container>
           <Container className="mb-3">
             <Row>
               <Col> <h1>SKUs</h1> </Col>
               <Col> </Col>
               <Col> <SKUsKeywordSearch/> </Col>
             </Row>
             <Row>
               <Col>
                 <IngFilters/>
               </Col>
               <Col>
                 <PLineFilters/>
               </Col>
               <Col style={{'textAlign': 'right'}}>
                 <Button onClick={this.onGBPLClick}> {groupByMsg}</Button> {' '}&nbsp;
                 {this.props.auth.isAdmin &&
                   <SKUAddModal/>}
               </Col>
             </Row>
           </Container>
           <Row>
             {this.props.skus.count === 0 ? (
               <em>Results: 0 total</em>
             ): (<em>Results: {results_start}-{results} of {this.props.skus.count} total</em>)}

               {this.props.skus.pagelimit === -1 ? (
                 <Button onClick={this.haveLimit} color="link" size="sm"> (Show 10 per page) </Button>
               ):
               (
                 <Button onClick={this.showAll} color="link" size="sm"> (Show all) </Button>
               )}
          </Row>
           <SKUsEntry/>
             <Row>
                 <Col style={{'textAlign':'center'}}>
                 <Button color="link" onClick={this.onPrevPage} disabled={!isPrevPage}> {' '}
                   <FontAwesomeIcon icon = "chevron-left"/>{' '}Prev
                 </Button>
                 Page: {this.props.skus.page}
                 <Button color="link" onClick={this.onNextPage} disabled={!isNextPage}>
                   Next{' '}<FontAwesomeIcon icon = "chevron-right"/>
                 </Button>
               </Col>
               </Row>
            <Row>
              <Col style={{textAlign:'left'}}>
                <SKUBulkEditMLines/>
              </Col>
              <Col style={{'textAlign': 'right'}}>
             <Button onClick={() =>  this.props.exportSKUs(this.props.skus.obj)}>Export SKUs</Button> &nbsp;
             </Col>
             </Row>
           </Container>
         </div>
       </Provider>
     );
   }
}

SKU.propTypes = {
  sortSKUs: PropTypes.func.isRequired,
  exportSKUs: PropTypes.func.isRequired,
  groupByPL: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  auth: state.auth
});


export default connect(mapStateToProps, {sortSKUs, groupByPL, exportSKUs})(SKU);
