import axios from "axios";

/*
axios.HTTPMETHOD(url, [data], { headers }).
POST/PUT need data. GET/DELETE do not.
*/

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
  headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const loginCustomer = async (email, password) => {
  return await axios.post(`${API_BASE_URL}/customer/login`, { email, password });
};

export const signupCustomer = async (data) => {
  return await axios.post(`${API_BASE_URL}/customer/signup`, data);
};

export const customerLogout = async () => {
  return await axios.post(`${API_BASE_URL}/customer/logout`, {}, authHeader());
};

//--------------------------------------------------------------------------------------
//Profile
export const updateCustomer = async (updateData) => {
  return await axios.put(`${API_BASE_URL}/customer/profile/update`, updateData, authHeader());
};

export const getCustomerProfile = async () => {
  return await axios.get(`${API_BASE_URL}/customer/profile`, authHeader());
};

const customerApi = {
  loginCustomer,
  signupCustomer,
  customerLogout,
  updateCustomer,
  getCustomerProfile
};

export { customerApi };