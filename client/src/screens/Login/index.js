import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { loginUser } from 'Services/authentication/actions';
import Sign from 'Shells/Sign';
import { APP_LINKS } from 'Config/routers/appLinks';

import LoginForm from './components/LoginForm';

class Login extends React.Component {
  componentDidUpdate() {
    this.redirectIfAuthenticated();
  }

  redirectIfAuthenticated = () => {
    const { auth, history } = this.props;
    if (auth.isAuthenticated) {
      history.push(APP_LINKS.LOOK_UP_MODULE);
    }
  };

  getLoginErrors = () => {
    let errors = {};
    const { errors: reduxStateErrors } = this.props;

    // FIXME: This can still be refactored

    if (!isEmpty(reduxStateErrors)) {
      if (reduxStateErrors.status === 504) {
        errors.notificationMsg = 'Không thể kết nối với máy chủ. Vui lòng thử lại sau.';
      } else if (!reduxStateErrors.data.success) {
        if (reduxStateErrors.data.errors.username) {
          if (reduxStateErrors.data.errors.username.includes('not found')) {
            errors.username = 'Tài khoản không tồn tại.';
          }
        } else if (reduxStateErrors.data.errors.password) {
          if (reduxStateErrors.data.errors.password.includes('incorrect')) {
            errors.password = 'Mật khẩu không đúng.';
          }
        }
      }
    }

    return errors;
  };

  postUserDataToServer = async userData => {
    const { loginUser: dispatchLoginUser } = this.props;
    await dispatchLoginUser(userData);

    return this.getLoginErrors();
  };

  render() {
    return (
      <Sign>
        <LoginForm postUserDataToServer={this.postUserDataToServer} />
      </Sign>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  loginUser: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth, errors }) => ({
  auth,
  errors
});

const mapDispatchToProps = dispatch => ({
  loginUser: userData => dispatch(loginUser(userData))
});

export { Login };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
