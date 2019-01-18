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
    return(<div>
      <Navbar dark expand="md" className="mb-5" style={{backgroundColor: '#8EE18C'}}>
          <NavbarBrand href="/">Hypothetical Meals</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Container className="">
        <Collapse className="justify-content-end" isOpen={this.state.isOpen} navbar>
          <Nav className="navbar-expand-md" navbar>
            <NavItem>
              <NavLink href="/ingredients">Ingredients</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/ingredients">Product Lines</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/ingredients">SKUs</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/ingredients">Import</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">Manufacturing</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">Reports</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">Sign Out</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        </Container>
      </Navbar>
    </div>);
  }


}


export default AppNavbar;
