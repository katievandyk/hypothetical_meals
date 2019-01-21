import React, {Component} from 'react';
import '../styles.css'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
} from 'reactstrap';

import { NavLink as RRNavLink } from 'react-router-dom';

class AppNavbar extends Component {
  state = {
    isOpen: false
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    //TO DO: Add when page is active
    return(<div>
      <Navbar dark expand="md" className="mb-5" style={{backgroundColor: '#8EE18C'}}>
          <NavbarBrand style={{color:'white'}}>Hypothetical Meals</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Container className="">
        <Collapse className="justify-content-end" isOpen={this.state.isOpen} navbar>
          <Nav className="navbar-expand-md" navbar>
            <NavItem>
              <NavLink tag={RRNavLink} to="/ingredients" className="nav-link" activeClassName="active">Ingredients</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/productlines" className="nav-link" activeClassName="active">Product Lines</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/sku" className="nav-link" activeClassName="active">SKUs</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/import" className="nav-link" activeClassName="active">Import</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/manufacturing" className="nav-link" activeClassName="active">Manufacturing</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/reports" className="nav-link" activeClassName="active">Reports</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/x" className="nav-link" activeClassName="active">Sign Out</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        </Container>
      </Navbar>
    </div>);
  }


}


export default AppNavbar;
