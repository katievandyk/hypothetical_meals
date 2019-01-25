import React from 'react';
import {
  Badge
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class IngredientsKeywordSearch extends React.Component {
  render() {
    return (
      <div>SKU Filters:  {'  '}
      <Badge href="#" color="light">None</Badge> {' '}
      <Badge href="#" color="success">+ Add SKU Filter</Badge>
      </div>
    );
  }
}
