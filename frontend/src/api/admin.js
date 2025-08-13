import axios from "axios";

/*
axios.HTTPMETHOD(url, [data], { headers }).
POST/PUT need data. GET/DELETE do not.
*/

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const authHeader = () => {
  const token = localStorage.getItem("accessToken");
  return {
  headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// ------------------------------ Login --------------------------
export const adminLogin = async (email, password) => {
  return await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
};

export const adminLogout = async () => {
  return await axios.post(`${API_BASE_URL}/admin/logout`, {}, authHeader());
};

export const getAdminDashboard = async () => {
  return await axios.get(`${API_BASE_URL}/admin/dashboard`, authHeader());
};


// ------------------------------ Brands -------------------------
export const getAllBrands = async () => {
  return await axios.get(`${API_BASE_URL}/admin/brands/`, authHeader());
}

export const getBrandProfile = async (id) => { //page for this so that admin can view brand profiles even if not active
  return await axios.get(`${API_BASE_URL}/admin/brands/${id}/profile`, authHeader());
}

export const brandApprove = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/approve`,
    {},
    authHeader()
  );
};

export const brandDisapprove = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/disapprove`,
    {},
    authHeader()
  );
};

export const activateBrand = async (id) => { ///this  added as a button to getbrandprofile
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/activate`,
    {},
    authHeader()
  );
};

export const deactivateBrand = async (id) => { ///this added to admindashboard
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/deactivate`,
    {},
    authHeader()
  );
};

// ------------------------------ Customer -------------------------
export const getAllCustomers = async () => { //added this to admindashboard
  return await axios.get(`${API_BASE_URL}/admin/customers/`, authHeader());
}

export const getCustomerById = async (id) => { //add this
  return await axios.get(`${API_BASE_URL}/admin/customers/${id}`, authHeader());
}

export const activateCustomer = async (id) => { //add this as a button to getcustomerbyid
  return await axios.put(
    `${API_BASE_URL}/admin/customers/${id}/activate`,
    {},
    authHeader()
  );
};

export const deactivateCustomer = async (id) => { //add this as a button to getcustomerbyid
  return await axios.put(
    `${API_BASE_URL}/admin/customers/${id}/deactivate`,
    {},
    authHeader()
  );
};

// ------------------------------ Orders -------------------------
export const getAllOrders = async () => {
  return await axios.get(`${API_BASE_URL}/admin/orders/`, authHeader());
}

export const getOrderById = async (id) => { //need to add this. its the same page for admin and brand
  return await axios.get(`${API_BASE_URL}/admin/orders/${id}`, authHeader());
} //for abubakr: make this one

export const updateOrderStatus = async (id, status) => {
  return await axios.put(
    `${API_BASE_URL}/admin/orders/${id}/status`,
    { status },
    authHeader()
  );
};

export const deactivateOrder = async (id) => {// need to add a button for this
  return await axios.put(
    `${API_BASE_URL}/admin/orders/${id}/deactivate`,
    {},
    authHeader()
  );
};

// ------------------------------ Products -------------------------
export const getAllProducts = async () => { //for abubakr: make this one
  return await axios.get(`${API_BASE_URL}/admin/products/`, authHeader());
}

export const getProductById = async (id) => { // for abubakr: make this one
  return await axios.get(`${API_BASE_URL}/admin/products/${id}`, authHeader());
}

export const activateProduct = async (id) => { //need to add this button if product is deactivated
  return await axios.put(
    `${API_BASE_URL}/admin/products/${id}/activate`,
    {},
    authHeader()
  );
};

export const deactivateProduct = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/products/${id}/deactivate`,
    {},
    authHeader()
  );
};

const adminApi = {
  adminLogin,
  adminLogout,
  getAdminDashboard,
  getAllBrands,
  getBrandProfile,
  brandApprove,
  brandDisapprove,
  activateBrand,
  deactivateBrand,
  getAllCustomers,
  getCustomerById,
  activateCustomer,
  deactivateCustomer,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deactivateOrder,
  getAllProducts,
  getProductById,
  activateProduct,
  deactivateProduct,
};

export {adminApi};