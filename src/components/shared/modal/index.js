import React from 'react';
import PropTypes from 'prop-types';
import Portal from './portal';
import { bg, wrapper } from './modal.module.scss';

function Modal({ children, className }) {
  return (
    <Portal>
      <div className={bg}>
        <div className={[wrapper, className].join(' ')}>{children}</div>
      </div>
    </Portal>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Modal;
