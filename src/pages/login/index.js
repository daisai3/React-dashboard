import React, { useState, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import sha256 from 'crypto-js/sha256';
import userService from '../../services/user.service';
import { storeUser } from '../../store/actions/auth';
import { Store } from '../../store/index';
import dewaLogo from '../../assets/images/dewa-logo.png';
import classes from './login.module.scss';
import config from '../../config';
import Spinner from '../../components/shared/spinner';

function Login() {
  // eslint-disable-next-line
  const [store, dispatch] = useContext(Store);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState('');

  function formHandler(event) {
    event.preventDefault();
    setLoading(true);
    const body = {
      email,
      hws: sha256(password + config.salt).toString(),
    };
    userService
      .login(body)
      .then((user) => {
        dispatch(storeUser(user));
        navigate('/');
        setErrMsg('');
        setLoading(false);
      })
      .catch((err) => {
        setErrMsg(err.message);
        setLoading(false);
      });
  }

  // if (store.user) {
  //   return <Redirect to="/" noThrow />;
  // }

  return (
    <div data-testid="login-page">
      <form onSubmit={formHandler} className={classes.wrapperBox}>
        <img src={dewaLogo} alt="DEWA logo" />
        {errMsg && <p className="Global_text_red">{errMsg}</p>}
        {loading ? (
          <div className="Spinner_contained">
            <Spinner />
          </div>
        ) : (
          <>
            <label htmlFor="email">
              <FormattedMessage id="email" defaultMessage="Email" />
              <input
                name="email"
                type="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label htmlFor="password">
              <FormattedMessage id="password" defaultMessage="Password" />
              <input
                name="password"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button
              type="submit"
              className="Global_btn Global_btn_green Global_align_right"
            >
              <FormattedMessage id="submit" defaultMessage="Submit" />
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default Login;
