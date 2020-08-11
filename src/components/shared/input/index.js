import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import classes from './Input.module.scss';

function renderOptions(options) {
  return options.map((item) => {
    if (typeof item === 'string') {
      return (
        <option key={item} value={item}>
          {item}
        </option>
      );
    }
    if (typeof item === 'object') {
      const hasKey = Object.prototype.hasOwnProperty.call(item, 'key');
      const hasValue = Object.prototype.hasOwnProperty.call(item, 'value');
      if (hasKey && hasValue) {
        return (
          <option key={item.key} value={item.key}>
            {item.value}
          </option>
        );
      }
      throw new Error('Options object has no attribute named key or value');
    }
    throw new Error('Options is not of type string or object');
  });
}

function getDisplayValue(value, options) {
  const testValue = options[0];
  if (!testValue) {
    return '';
  }
  if (typeof testValue === 'string') {
    return value;
  }
  if (typeof testValue === 'object') {
    const index = options.findIndex((item) => item.key === value);
    if (index === -1) {
      return '';
    }
    return options[index].value;
  }
  throw new Error('Options is not of type string or object');
}

function Input({ label, value, onChange, options, readOnly = false }) {
  const [isEditable, setEditable] = useState(false);

  function toggleEditable() {
    setEditable(!isEditable);
  }

  return (
    <div className={classes.input}>
      <label htmlFor={label} className={classes.label}>
        {label}
        {!readOnly && (
          <button
            data-testid="toggle-input"
            type="button"
            onClick={toggleEditable}
          >
            <Icon name="edit" />
          </button>
        )}
      </label>
      {isEditable ? (
        <select
          data-testid="select-input"
          id={label}
          name={label}
          value={value}
          onChange={onChange}
          onBlur={onChange}
        >
          {renderOptions(options)}
        </select>
      ) : (
        <p data-testid="readOnly-input">{getDisplayValue(value, options)}</p>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(PropTypes.string),
    ]),
  ).isRequired,
  readOnly: PropTypes.bool,
};

export default React.memo(Input);
