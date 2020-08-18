/* eslint-disable */
import axios from 'axios';
import { alert, hidessignup_alert, signup_alert } from './alert';
exports.start_login = async function (email, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/candidate/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status == 'success') {
      window.setTimeout(() => {
        alert('You are logged in', 'success');
        location.assign('/EC/mainpage');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message, 'error');
  }
};
exports.start_logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/candidate/logout',
    });

    if (res.data.status == 'success') {
      window.setTimeout(() => {
        window.location.reload('true');
        window.location.assign('/EC/mainpage');
      }, 1000);
    }
  } catch (err) {}
};
exports.start_signup = async (
  name,
  email,
  password,
  confirmPassword,
  role,
  worksFor,
  post
) => {
  try {
    signup_alert();
    let response;
    if (role == 'candidate') {
      response = await axios({
        method: 'POST',
        url: '/api/v1/candidate/signup',
        data: {
          email,
          name,
          password,
          confirmPassword,
          role,
          post,
        },
      });
    } else {
      response = await axios({
        method: 'POST',
        url: '/api/v1/candidate/signup',
        data: {
          email,
          name,
          password,
          confirmPassword,
          role,
          worksFor,
        },
      });
    }
    if (response.data.status == 'success') {
      hidessignup_alert();
      alert('Please verify your account on mail', 'success');
      window.setTimeout(() => {
        window.location.assign('/EC/mainpage');
      }, 2000);
    }
  } catch (err) {
    alert(err.response.data.message, 'error');
  }
};
exports.start_forgetpassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/candidate/forgetpassword',
      data: {
        email: email,
      },
    });
    if (res.data.status == 'success') {
      alert('Please check your mail to reset your password', 'success');
      window.setTimeout(() => {
        window.location.assign('/EC/mainpage');
      }, 2500);
    }
  } catch (err) {
    alert(err.response.data.message, 'error');
  }
};
exports.start_reset = async (password, confirmpassword, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/candidate/resetpassword/${token}`,
      data: {
        password,
        confirmPassword: confirmpassword,
      },
    });
    if (res.data.status == 'success') {
      alert('Your password was reset Login again', 'success');
      window.setTimeout(() => {
        window.location.assign('/EC/mainpage');
      }, 2500);
    }
  } catch (err) {
    alert(err.response.data.message, 'error');
  }
};
