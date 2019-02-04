import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css' // TODO change css file
import GoalsCreateForm from '../../components/goals/GoalsCreateForm';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class GoalsCreateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
    if(this.state.modal) this.props.refresh();
  }

  render() {
    return (
      <div>
        <Button onClick={this.toggle} color="success" style={{'display': 'inline-block'}}>{this.props.buttonLabel}</Button>
        <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader>Create Goal</ModalHeader>
          <ModalBody>
            <GoalsCreateForm toggle={this.toggle}/>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default GoalsCreateModal;
