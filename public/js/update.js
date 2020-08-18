/* eslint-disable */
import axios from 'axios';
import { alert } from './alert';
exports.update_person = async (data, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/candidate/contestents/${id}`,
      data,
    });
    if (res.data.status == 'success') {
      window.setTimeout(() => {
        alert('Your info is updated ', 'success');
        location.assign(`/EC/person/${id}`);
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message, 'error');
  }
};
exports.register_person = async (
  name,
  email,
  role,
  address,
  phoneNo,
  Rollno,
  id
) => {
  try {
    let password = `${Rollno}${name}`;
    // console.log(name, email, role, address, phoneNo, Rollno, id);
    const res = await axios({
      method: 'POST',
      url: `/api/v1/candidate/contestents`,
      data: {
        name,
        email,
        role,
        address,
        Rollno,
        phoneNo,
        active: true,
        worksFor: id,
        password,
        confirmPassword: password,
      },
    });
    if (res.data.status == 'success') {
      window.setTimeout(() => {
        alert('Your info is updated ', 'success');
        location.assign(`/EC/Myteam/${id}`);
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message, 'error');
  }
};
exports.start_delete = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/candidate/contestents/${id}`,
    });
    if (res.data.status == 204) {
      alert('The info is updated ', 'success');
      window.setTimeout(() => {
        location.assign(`/EC/posts`);
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message, 'error');
  }
};
