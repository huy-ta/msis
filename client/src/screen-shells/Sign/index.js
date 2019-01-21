import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import SignFormContainer from './components/SignFormContainer';

const styles = ({ palette }) => ({
  root: {
    alignItems: 'center',
    backgroundColor: `${palette.primary.main}`,
    backgroundImage: `linear-gradient(-45deg, ${palette.secondary.main} 40%, ${
      palette.primary.main
    } 40%)`,
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden'
  }
});

export const Sign = props => {
  const { classes, children } = props;
  const { root } = classes;

  return (
    <div className={root}>
      <SignFormContainer>{children}</SignFormContainer>
    </div>
  );
};

Sign.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired
};

const StyledSign = withStyles(styles)(Sign);

export { StyledSign };

export default StyledSign;
