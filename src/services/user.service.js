import Axios from 'axios';
import { navigate } from '@reach/router';
import { appendParams, getAPIURL } from '../utils';

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;

const BASE_PATH = '/api/v1/users';
const FULL_URL = `${getAPIURL()}${BASE_PATH}`;

function getUser() {
  return Axios.get(`${FULL_URL}/`);
}

function updateUser(data) {
  return Axios.put(`${FULL_URL}/`, data);
}

function deleteUser({ center, email }) {
  const url = appendParams(`${FULL_URL}/`, {
    center,
    email,
  });
  return Axios.delete(url);
}

function getWorkingHours() {
  return Axios.get(`${FULL_URL}/select/working_hours/`);
}

function getStatusTypes() {
  return Axios.get(`${FULL_URL}/select/status/`);
}

function getAllLanguages() {
  return Axios.get(`${FULL_URL}/select/languages/`);
}

function logout() {
  window.localStorage.removeItem('dewa_auth');
  return Axios.get(`${FULL_URL}/logout`).then(() => {
    window.location.reload(false);
  });
}

function login(body) {
  return Axios.post(`${FULL_URL}/login`, body)
    .then((response) => {
      const { user, auth_token } = response.data;
      window.localStorage.setItem('dewa_auth', auth_token);
      window.addEventListener('beforeunload', logout);
      Axios.defaults.headers.common.Authorization = auth_token;
      Axios.interceptors.response.use(
        (resp) => resp,
        (error) => {
          if (error?.response?.status === UNAUTHORIZED) {
            navigate('/login');
          }
          return Promise.reject(error);
        },
      );
      return user;
    })
    .catch((err) => {
      if (err?.response?.status === BAD_REQUEST)
        throw new Error('User or password incorrect');
    });
}

function persistSession(auth_token) {
  window.addEventListener('beforeunload', logout);
  Axios.defaults.headers.common.Authorization = auth_token;
  return getUser();
}

function register(body) {
  return Axios.post(`${FULL_URL}/register`, body);
}

export default {
  login,
  register,
  logout,
  persistSession,
  getUser,
  updateUser,
  deleteUser,
  getWorkingHours,
  getStatusTypes,
  getAllLanguages,
};
