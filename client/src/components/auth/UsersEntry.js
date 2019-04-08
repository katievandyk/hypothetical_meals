import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeAdmin, revokeAdmin, makeAnalyst, revokeAnalyst, makeProduct, revokeProduct, 
  makeBusiness, revokeBusiness, deleteUser, getAllUsers, makePlant, revokePlant } from "../../actions/authActions";
  import { getLines } from '../../actions/linesActions';
import {Alert,  ListGroup, ListGroupItem} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Container,
Row, Col, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
class UsersEntry extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      errors: {},
      userCreated_alert: false,
      revoke_modal: false,
      grant_modal: false,
      revoke_analyst_modal: false,
      grant_analyst_modal: false,
      revoke_product_modal: false,
      grant_product_modal: false,
      revoke_business_modal: false,
      grant_business_modal: false,
      revoke_plant_modal: false,
      grant_plant_modal: false,
      lines: [],
      edit_user: {}
    };
  }

componentDidMount() {
  this.props.getAllUsers();
  this.props.getLines()
}

componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  toggle = () => {
    this.setState({
      userCreated_alert: !this.userCreated_alert
    })
  }

revoke_toggle = () => {
  this.setState({
    revoke_modal: !this.state.revoke_modal
  })
}

grant_toggle = () => {
  this.setState({
    grant_modal: !this.state.grant_modal
  })
}

revoke_analyst_toggle = () => {
  this.setState({
    revoke_analyst_modal: !this.state.revoke_analyst_modal
  })
}

grant_analyst_toggle = () => {
  this.setState({
    grant_analyst_modal: !this.state.grant_analyst_modal
  })
}

revoke_product_toggle = () => {
  this.setState({
    revoke_product_modal: !this.state.revoke_product_modal
  })
}

grant_product_toggle = () => {
  this.setState({
    grant_product_modal: !this.state.grant_product_modal
  })
}

revoke_business_toggle = () => {
  this.setState({
    revoke_business_modal: !this.state.revoke_business_modal
  })
}

grant_business_toggle = () => {
  this.setState({
    grant_business_modal: !this.state.grant_business_modal
  })
}

revoke_plant_toggle = () => {
  this.setState({
    revoke_plant_modal: !this.state.revoke_plant_modal
  })
}

grant_plant_toggle = () => {
  this.setState({
    grant_plant_modal: !this.state.grant_plant_modal
  })
}

onEditAdminClick = (_id, name, username, isAdmin, e) => {
  const newObj = {_id: _id, name: name, username: username, isAdmin: isAdmin};
  if(isAdmin){
    this.setState({
      revoke_modal: true,
      grant_modal: false,
      edit_user: newObj
    });
  }
  else {
    this.setState({
      revoke_modal: false,
      grant_modal: true,
      edit_user: newObj
    });
  }
}

onEditAnalystClick = (_id, name, username, analyst, e) => {
  const newObj = {_id: _id, name: name, username: username, analyst: analyst};
  if(analyst){
    this.setState({
      revoke_analyst_modal: true,
      grant_analyst_modal: false,
      edit_user: newObj
    });
  }
  else {
    this.setState({
      revoke_analyst_modal: false,
      grant_analyst_modal: true,
      edit_user: newObj
    });
  }
}

onEditProductClick = (_id, name, username, product, e) => {
  const newObj = {_id: _id, name: name, username: username, product: product};
  if(product){
    this.setState({
      revoke_product_modal: true,
      grant_product_modal: false,
      edit_user: newObj
    });
  }
  else {
    this.setState({
      revoke_product_modal: false,
      grant_product_modal: true,
      edit_user: newObj
    });
  }
}

onEditBusinessClick = (_id, name, username, business, e) => {
  const newObj = {_id: _id, name: name, username: username, business: business};
  if(business){
    this.setState({
      revoke_business_modal: true,
      grant_business_modal: false,
      edit_user: newObj
    });
  }
  else {
    this.setState({
      revoke_business_modal: false,
      grant_business_modal: true,
      edit_user: newObj
    });
  }
}

onEditPlantClick = (_id, name, username, plant, lines, e) => {
  const newObj = {_id: _id, name: name, username: username, plant: plant};
  if(plant){
    this.setState({
      revoke_plant_modal: false,
      grant_plant_modal: true,
      lines : lines,
      edit_user: newObj
    });
  }
  else {
    this.setState({
      revoke_plant_modal: false,
      grant_plant_modal: true,
      lines : lines,
      edit_user: newObj
    });
  }
}

onDeleteClick = (username, e) => {
  this.props.deleteUser({username:username});
}

revoke = (username, e) => {
  this.props.revokeAdmin({username: username});
  this.revoke_toggle();
}

grant = (username, e) => {
  this.props.makeAdmin({username: username});
  this.grant_toggle();
}

revoke_analyst = (username, e) => {
  this.props.revokeAnalyst({username: username});
  this.revoke_analyst_toggle();
}

grant_analyst = (username, e) => {
  this.props.makeAnalyst({username: username});
  this.grant_analyst_toggle();
}

revoke_product = (username, e) => {
  this.props.revokeProduct({username: username});
  this.revoke_product_toggle();
}

grant_product = (username, e) => {
  this.props.makeProduct({username: username});
  this.grant_product_toggle();
}

revoke_business = (username, e) => {
  this.props.revokeBusiness({username: username});
  this.revoke_business_toggle();
}

grant_business = (username, e) => {
  this.props.makeBusiness({username: username});
  this.grant_business_toggle();
}

grant_plant = (username, lines, e) => {
  this.props.makePlant({username: username, lines: lines});
  this.grant_plant_toggle();
}

assignLine = (id, username, e) => {
  const user = this.props.auth.users.find( doc => {
    return doc.username === username;
  })
  const lines = user.lines;
  const index = lines.findIndex(i => i._id === id)
    if (index < 0) {
      this.props.makePlant({line : id, username: username})
    } else {
      this.props.revokePlant({line : id, username: username})
    }
}

checkLinesContains = (id) => {
  var user;
    user =this.props.auth.users.find(doc => {
      return doc.username ===this.state.edit_user.username
    })
 
  var i;
  try {
    for(i=0; i < user.lines.length; i++) {
      if(user.lines[i]._id === id) {
        return true;
      }
    }
  }
  catch(err) {
    console.log('No edit user has been defined')
  }
}

render() {
    const { errors } = this.state;
    const users = this.props.auth.users;
return (
      <div className="container">
        <Container>
        <Row>
          <Col>
          </Col>
          <Col>
            <Alert toggle={this.toggle} isOpen={this.state.userCreated_alert && !errors.username}> Admin User {this.state.username} created! </Alert>
          </Col>
          <Col></Col>
        </Row>
          <Row>
            <Table responsive size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Analyst?</th>
                  <th>Product Manager?</th>
                  <th>Business Manager?</th>
                  <th>Plant Manager?</th>
                  <th>Admin?</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody is="transition-group" >
                <TransitionGroup className="ingredients-table" component={null}>
                  {users.map(({_id, name, username, isAdmin, analyst, product, business, plant, lines}) => (
                    <CSSTransition key={_id} timeout={500} classNames="fade">
                      <tr>
                        <td> {name} </td>
                        <td> {username} </td>
                        <td>
                            {analyst?("Y"):("N")}
                            <Button size="sm" color="link" disabled={this.props.auth.user.id === _id}
                              onClick={this.onEditAnalystClick.bind(this,
                                _id, name, username, analyst
                              )}
                              style={this.props.auth.user.id === _id?({'color': 'lightgrey'}):({'color':'black'})}>
                              <FontAwesomeIcon icon = "user-cog"/>
                            </Button>
                        </td>
                        <td>
                            {product?("Y"):("N")}
                            <Button size="sm" color="link" disabled={this.props.auth.user.id === _id}
                              onClick={this.onEditProductClick.bind(this,
                                _id, name, username, product
                              )}
                              style={this.props.auth.user.id === _id?({'color': 'lightgrey'}):({'color':'black'})}>
                              <FontAwesomeIcon icon = "user-cog"/>
                            </Button>
                        </td>
                        <td>
                            {business?("Y"):("N")}
                            <Button size="sm" color="link" disabled={this.props.auth.user.id === _id}
                              onClick={this.onEditBusinessClick.bind(this,
                                _id, name, username, business
                              )}
                              style={this.props.auth.user.id === _id?({'color': 'lightgrey'}):({'color':'black'})}>
                              <FontAwesomeIcon icon = "user-cog"/>
                            </Button>
                        </td>
                        <td>
                            {plant?("Y"):("N")}
                            <Button size="sm" color="link" disabled={this.props.auth.user.id === _id}
                              onClick={this.onEditPlantClick.bind(this,
                                _id, name, username, plant, lines
                              )}
                              style={this.props.auth.user.id === _id?({'color': 'lightgrey'}):({'color':'black'})}>
                              <FontAwesomeIcon icon = "user-cog"/>
                            </Button>
                        </td>
                        <td> {isAdmin?("Y"):("N")} 
                            <Button size="sm" color="link" disabled={this.props.auth.user.id === _id}
                              onClick={this.onEditAdminClick.bind(this,
                                _id, name, username, isAdmin
                              )}
                              style={this.props.auth.user.id === _id?({'color': 'lightgrey'}):({'color':'black'})}>
                              <FontAwesomeIcon icon = "user-cog"/>
                            </Button> </td>
                        
                        <td >
                          <Button size="sm" sm="2"color="link" disabled={this.props.auth.user.id === _id}
                            onClick={this.onDeleteClick.bind(this, username)}
                              style={this.props.auth.user.id === _id?({'color': 'lightgrey'}):({'color':'black'})}>
                            <FontAwesomeIcon icon="trash"/>
                          </Button>
                        </td>
                      </tr>
                    </CSSTransition>
                ))}
                </TransitionGroup>
              </tbody>
            </Table>
          </Row>
          </Container>

          <Modal isOpen={this.state.revoke_modal} toggle={this.revoke_toggle}>
          <ModalHeader toggle={this.revoke_toggle}>
          Revoke Admin Status for {this.state.edit_user.name}</ModalHeader>
        <ModalBody>
          Are you sure you want to <b>Revoke Admin Status</b> for {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
        </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={this.revoke.bind(this, this.state.edit_user.username)}>Yes - Revoke</Button>
        <Button onClick={this.revoke_toggle}>Cancel</Button>
      </ModalFooter></Modal>

      <Modal isOpen={this.state.grant_modal} toggle={this.grant_toggle}>
        <ModalHeader toggle={this.grant_toggle}>
        Grant Admin Status to {this.state.edit_user.name}</ModalHeader>
      <ModalBody>
        Are you sure you want to <b>Grant Admin Status</b> to {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={this.grant.bind(this, this.state.edit_user.username)}>Yes - Grant</Button>
        <Button onClick={this.grant_toggle}>Cancel</Button></ModalFooter></Modal>

        <Modal isOpen={this.state.revoke_analyst_modal} toggle={this.revoke_analyst_toggle}>
          <ModalHeader toggle={this.revoke_analyst_toggle}>
          Revoke Analyst Status for {this.state.edit_user.name}</ModalHeader>
        <ModalBody>
          Are you sure you want to <b>Revoke Analyst Status</b> for {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
        </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={this.revoke_analyst.bind(this, this.state.edit_user.username)}>Yes - Revoke</Button>
        <Button onClick={this.revoke_toggle}>Cancel</Button>
      </ModalFooter></Modal>

      <Modal isOpen={this.state.grant_analyst_modal} toggle={this.grant_analyst_toggle}>
        <ModalHeader toggle={this.grant_analyst_toggle}>
        Grant Analyst Status to {this.state.edit_user.name}</ModalHeader>
      <ModalBody>
        Are you sure you want to <b>Grant Analyst Status</b> to {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={this.grant_analyst.bind(this, this.state.edit_user.username)}>Yes - Grant</Button>
        <Button onClick={this.grant_toggle}>Cancel</Button></ModalFooter></Modal>

        <Modal isOpen={this.state.revoke_product_modal} toggle={this.revoke_product_toggle}>
          <ModalHeader toggle={this.revoke_product_toggle}>
          Revoke Product Manager Status for {this.state.edit_user.name}</ModalHeader>
        <ModalBody>
          Are you sure you want to <b>Revoke Product Manager Status</b> for {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
        </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={this.revoke_product.bind(this, this.state.edit_user.username)}>Yes - Revoke</Button>
        <Button onClick={this.revoke_toggle}>Cancel</Button>
      </ModalFooter></Modal>

      <Modal isOpen={this.state.grant_product_modal} toggle={this.grant_product_toggle}>
        <ModalHeader toggle={this.grant_product_toggle}>
        Grant Product Manager Status to {this.state.edit_user.name}</ModalHeader>
      <ModalBody>
        Are you sure you want to <b>Grant Product Manager Status</b> to {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={this.grant_product.bind(this, this.state.edit_user.username)}>Yes - Grant</Button>
        <Button onClick={this.grant_toggle}>Cancel</Button></ModalFooter></Modal>

        <Modal isOpen={this.state.revoke_business_modal} toggle={this.revoke_business_toggle}>
          <ModalHeader toggle={this.revoke_business_toggle}>
          Revoke Business Manager Status for {this.state.edit_user.name}</ModalHeader>
        <ModalBody>
          Are you sure you want to <b>Revoke Business Manager Status</b> for {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
        </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={this.revoke_business.bind(this, this.state.edit_user.username)}>Yes - Revoke</Button>
        <Button onClick={this.revoke_toggle}>Cancel</Button>
      </ModalFooter></Modal>

      <Modal isOpen={this.state.grant_business_modal} toggle={this.grant_business_toggle}>
        <ModalHeader toggle={this.grant_business_toggle}>
        Grant Business Manager Status to {this.state.edit_user.name}</ModalHeader>
      <ModalBody>
        Are you sure you want to <b>Grant Business Manager Status</b> to {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={this.grant_business.bind(this, this.state.edit_user.username)}>Yes - Grant</Button>
        <Button onClick={this.grant_toggle}>Cancel</Button></ModalFooter></Modal>

        <Modal isOpen={this.state.grant_plant_modal} toggle={this.grant_plant_toggle}>
        <ModalHeader toggle={this.grant_plant_toggle}>
        Grant Plant Manager Status to {this.state.edit_user.name} for the following lines</ModalHeader>
      <ModalBody>
        <ListGroup>
            {this.props.lines.lines.map(({name, shortname, _id}) => (
            <ListGroupItem key={_id} 
              action color={this.checkLinesContains(_id)?("info"):("")} 
              tag="button" onClick={() => this.assignLine(_id, this.state.edit_user.username)} 
              md={2} >
              {name}
            </ListGroupItem>
            ))}
        </ListGroup>
      </ModalBody>
      </Modal>
      </div>
    );
  }
}
UsersEntry.propTypes = {
  makeAdmin: PropTypes.func.isRequired,
  revokeAdmin: PropTypes.func.isRequired,
  makeAnalyst: PropTypes.func.isRequired,
  revokeAnalyst: PropTypes.func.isRequired,
  makeProduct: PropTypes.func.isRequired,
  revokeProduct: PropTypes.func.isRequired,
  makeBusiness: PropTypes.func.isRequired,
  revokeBusiness: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  makePlant: PropTypes.func.isRequired,
  revokePlant: PropTypes.func.isRequired,
  getLines: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  lines: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  lines: state.lines,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { makeAdmin, revokeAdmin, makeAnalyst, revokeAnalyst, makeProduct, revokeProduct,
     makeBusiness, revokeBusiness, getAllUsers, deleteUser, makePlant, revokePlant, getLines })(withRouter(UsersEntry));
