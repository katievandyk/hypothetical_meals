import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const NotUserRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (auth.isAdmin || auth.user.business || auth.user.plant ||auth.user.product || auth.user.analyst) ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

NotUserRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(NotUserRoute);