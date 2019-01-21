import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { APP_LINKS } from 'Config/routers/appLinks';

const SuccessNotice = props => {
  const { parentClasses, handleReset, history } = props;

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Tạo học phần thành công
      </Typography>
      <Typography variant="subtitle1">
        Học phần đã được tạo thành công. Bạn có thể lựa chọn tới trang tìm kiếm học phần hoặc tiếp tục tạo học phần mới.
      </Typography>
      <div className={parentClasses.buttons}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push(APP_LINKS.LOOK_UP_MODULE);
          }}
          className={parentClasses.button}
        >
          Tìm kiếm học phần
        </Button>
        <Button variant="text" color="primary" onClick={handleReset} className={parentClasses.button}>
          Tiếp tục tạo học phần
        </Button>
      </div>
    </React.Fragment>
  );
};

SuccessNotice.propTypes = {
  parentClasses: PropTypes.shape({}).isRequired,
  handleReset: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired
};

export default withRouter(SuccessNotice);
