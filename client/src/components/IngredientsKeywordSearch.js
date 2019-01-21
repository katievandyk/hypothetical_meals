import React from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class IngredientsKeywordSearch extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
      <InputGroup>
        <Input placeholder="Keyword Search"/>
        <InputGroupAddon addonType="append"><Button><FontAwesomeIcon icon = "search"/></Button></InputGroupAddon>
      </InputGroup>
      </div>
    );
  }
}
