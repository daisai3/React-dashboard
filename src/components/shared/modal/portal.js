import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById('portal');

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.inner = document.createElement('div');
  }

  componentDidMount() {
    rootEl.appendChild(this.inner);
  }

  componentWillUnmount() {
    rootEl.removeChild(this.inner);
  }

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.inner);
  }
}

Portal.propTypes = {
  children: PropTypes.node,
};

export default Portal;
