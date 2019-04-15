import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { loginNetID } from "../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";


class NetID extends Component {
    constructor(props) {
        super(props);
        const querystring = require('query-string');
        this.state = {
          errors: {},
          token: querystring.parse(window.location.hash).access_token
        };
        this.props.loginNetID(this.state.token);
    }
   render() {
        return (<Redirect to={"/ingredients"} />);
    }
}

NetID.propTypes = {
    loginNetID: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });
  export default connect(
    mapStateToProps,
    { loginNetID }
  )(NetID);