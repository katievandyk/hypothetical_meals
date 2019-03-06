import React, {Component} from 'react';
import { logoutUser } from "../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import '../styles.css'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { withRouter } from "react-router";
import { NavLink as RRNavLink } from 'react-router-dom';

class AppNavbar extends Component {
  state = {
    isOpen: false
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return(<div>
      <Navbar dark expand="md" className="mb-5" style={{backgroundColor: '#28a745'}}>
          <NavbarBrand style={{color:'white'}}>Hypothetical Meals</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Container className="">
        <Collapse className="justify-content-end" isOpen={this.state.isOpen} navbar>
          {this.props.auth.isAuthenticated ? (
          <Nav className="navbar-expand-md" navbar>
            {/*this.props.auth.isAdmin ? (
            <UncontrolledDropdown nav
            active={
              (this.props.location.pathname === '/register' ||
              this.props.location.pathname === '/makeAdmin') ?
              (true) : (false)
            }
            inNavbar>
             <DropdownToggle nav caret>
               Users
             </DropdownToggle>
             <DropdownMenu right>
               <DropdownItem>
                <NavLink tag={RRNavLink} to="/register" className="nav-link" activeClassName="active">Register</NavLink>
               </DropdownItem>
               <DropdownItem>
                 <NavLink tag={RRNavLink} to="/makeAdmin" className="nav-link" activeClassName="active">Make Admin</NavLink>
               </DropdownItem>
               <DropdownItem>
                 <NavLink tag={RRNavLink} to="/manageUsers" className="nav-link" activeClassName="active">Manage Users</NavLink>
               </DropdownItem>
             </DropdownMenu>
           </UncontrolledDropdown>
         ): (<div></div>)*/}
            {this.props.auth.isAdmin ? (<NavItem>
              <NavLink tag={RRNavLink} to="/manageUsers" className="nav-link" activeClassName="active">Manage Users</NavLink>
            </NavItem>): (<div></div>)}
            <UncontrolledDropdown nav
              active={
                (this.props.location.pathname === '/ingredients' ||
                this.props.location.pathname === '/productlines' ||
                this.props.location.pathname === '/sku' ||
                this.props.location.pathname === '/formulas') ?
                (true) : (false)
              }
              inNavbar>
               <DropdownToggle nav caret>
                 Data Management
               </DropdownToggle>
               <DropdownMenu right>
                 <NavLink tag={RRNavLink} to="/ingredients" className="nav-link" activeClassName="active">
                 <DropdownItem>
                  Ingredients
                 </DropdownItem>
                 </NavLink>
                 <NavLink tag={RRNavLink} to="/productlines" className="nav-link" activeClassName="active">
                 <DropdownItem>
                   Product Lines
                 </DropdownItem>
                 </NavLink>
                 <NavLink tag={RRNavLink} to="/sku" className="nav-link" activeClassName="active">
                 <DropdownItem>
                   SKUs
                 </DropdownItem>
                 </NavLink>
                 <NavLink tag={RRNavLink} to="/formulas" className="nav-link" activeClassName="active">
                 <DropdownItem>
                   Formulas
                 </DropdownItem>
                 </NavLink>
               </DropdownMenu>
             </UncontrolledDropdown>
            {this.props.auth.isAdmin ? (<NavItem>
              <NavLink tag={RRNavLink} to="/import" className="nav-link" activeClassName="active">Import</NavLink>
            </NavItem>): (<div></div>)}
            <UncontrolledDropdown nav
              active={
                (this.props.location.pathname === '/manufacturinggoals' ||
                this.props.location.pathname === '/manufacturingschedule' ||
                this.props.location.pathname === '/manufacturinglines') ?
                (true) : (false)
              }
            inNavbar>
               <DropdownToggle nav caret>
                 Manufacturing
               </DropdownToggle>
               <DropdownMenu right>
                 <NavLink tag={RRNavLink} to="/manufacturinggoals" className="nav-link" activeClassName="active">
                 <DropdownItem>
                  Goals
                 </DropdownItem>
                 </NavLink>
                 <NavLink tag={RRNavLink} to="/manufacturingschedule" className="nav-link" activeClassName="active">
                 <DropdownItem>
                  Schedule
                 </DropdownItem>
                 </NavLink>
                 <NavLink tag={RRNavLink} to="/manufacturinglines" className="nav-link" activeClassName="active">
                 <DropdownItem>
                    Lines
                 </DropdownItem>
                 </NavLink>
               </DropdownMenu>
             </UncontrolledDropdown>
            <UncontrolledDropdown nav
              active={
              (this.props.location.pathname === '/ingredients-dependency-report' ||
              this.props.location.pathname === '/manufacturing-schedule-report') ?
              (true) : (false)
            }
              inNavbar >
              <DropdownToggle nav caret> Reports </DropdownToggle>
              <DropdownMenu right>
                <NavLink tag={RRNavLink} to="/ingredients-dependency-report" className="nav-link" activeClassName="active">
                <DropdownItem>
                  Ingredients Dependency Report
                </DropdownItem>
                </NavLink>
                <NavLink tag={RRNavLink} to="/manufacturing-schedule-report" className="nav-link" activeClassName="active">
                <DropdownItem>
                  Manufacturing Schedule Report
                </DropdownItem>
                </NavLink>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink tag={RRNavLink} onClick={this.onLogoutClick} to="/login" className="nav-link" activeClassName="active">Sign Out</NavLink>
            </NavItem>
          </Nav>): (<div></div>)}
        </Collapse>
        </Container>
      </Navbar>
    </div>);
  }


}

AppNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(AppNavbar));
