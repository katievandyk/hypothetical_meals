import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
const ProductRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (auth.isAdmin || auth.user.product) ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);
ProductRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(ProductRoute);