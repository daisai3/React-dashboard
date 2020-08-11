import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
// import Icon from '../icon';
import classes from './Input.module.scss';

function Input({
  type,
  label,
  name,
  placeholder,
  value,
  data,
  onChange,
  readOnly,
  ...args
}) {
  if (type === 'select') {
    let optionsMap = data;
    if (Array.isArray(data)) {
      optionsMap = {};
      data.forEach((item) => {
        optionsMap[item] = item;
      });
    }
    optionsMap = Object.entries(optionsMap).map(([key, display]) => (
      <option key={key} value={key}>
        {display}
      </option>
    ));
    return (
      <div className={cx(classes.outlinedInput, classes.fromInput)}>
        <label className="text-smaller" htmlFor={name}>
          {label}
        </label>
        <select
          type={type}
          className="text-normal"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
          onBlur={onChange}
          {...args}
        >
          <option value="">Select {label}</option>
          {optionsMap}
        </select>
      </div>
    );
  }
  return (
    <div className={cx(classes.outlinedInput, classes.fromInput)}>
      <label className="text-smaller" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        className="text-normal"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
        {...args}
      />
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  autoFocus: PropTypes.bool,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.shape(), PropTypes.array]),
};
Input.defaultProps = {
  type: 'text',
  name: '',
  label: '',
  value: '',
  autoFocus: false,
  placeholder: '',
  readOnly: false,
  onChange: () => {},
};

export default React.memo(Input);
