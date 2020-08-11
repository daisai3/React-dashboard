import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import classes from './section-wrapper.module.scss';

function SectionWrapper({ border, children }) {
  return (
    <div className={cx(classes.mainWrapper, classes[`${border}-wrapper`])}>
      {children}
    </div>
  );
}

SectionWrapper.propTypes = {
  border: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

SectionWrapper.defaultProps = {
  border: '',
};

export default React.memo(SectionWrapper);
