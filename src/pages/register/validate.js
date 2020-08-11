const MIN_PASS_LENGTH = 8;

export default (form, errors) => {
  const updatedErr = { ...errors };
  if (form.name.touched && form.name.value === '') {
    updatedErr.nameErr = 'Name is required';
  } else {
    updatedErr.nameErr = '';
  }

  if (form.job_title.touched && form.job_title.value === '') {
    updatedErr.job_titleErr = 'Job description is required';
  } else {
    updatedErr.job_titleErr = '';
  }

  if (form.email.touched && form.email.value === '') {
    updatedErr.emailErr = 'Email is required';
  } else if (form.email.touched && !/\S+@\S+\.\S+/i.test(form.email.value)) {
    updatedErr.emailErr = 'Not a valid email format';
  } else {
    updatedErr.emailErr = '';
  }

  if (form.password.touched && form.password.value === '') {
    updatedErr.passwordErr = 'Password is required';
  } else if (
    form.password.touched &&
    form.password.value.length < MIN_PASS_LENGTH
  ) {
    updatedErr.passwordErr = 'Password must be at least 8 characters long';
  } else {
    updatedErr.passwordErr = '';
  }

  if (form.role.touched && form.role.value === '') {
    updatedErr.roleErr = 'Role is required';
  } else {
    updatedErr.roleErr = '';
  }

  if (form.center_name.touched && form.center_name.value === '') {
    updatedErr.center_nameErr = 'A center must be assigned';
  } else {
    updatedErr.center_nameErr = '';
  }

  if (form.working_hours.touched && form.working_hours.value === '') {
    updatedErr.working_hoursErr = 'Type of contract is required';
  } else {
    updatedErr.working_hoursErr = '';
  }
  return updatedErr;
};
