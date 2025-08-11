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

export const getBrandProfile = async (id) => {
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

export const activateBrand = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/activate`,
    {},
    authHeader()
  );
};

export const deactivateBrand = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/deactivate`,
    {},
    authHeader()
  );
};

// ------------------------------ Customer -------------------------
export const getAllCustomers = async () => {
  return await axios.get(`${API_BASE_URL}/admin/customers/`, authHeader());
}

export const getCustomerById = async (id) => {
  return await axios.get(`${API_BASE_URL}/admin/customers/${id}`, authHeader());
}

export const activateCustomer = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/customers/${id}/activate`,
    {},
    authHeader()
  );
};

export const deactivateCustomer = async (id) => {
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

export const getOrderById = async (id) => {
  return await axios.get(`${API_BASE_URL}/admin/orders/${id}`, authHeader());
}

export const updateOrderStatus = async (id, status) => {
  return await axios.put(
    `${API_BASE_URL}/admin/orders/${id}/status`,
    { status },
    authHeader()
  );
};

export const deactivateOrder = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/orders/${id}/deactivate`,
    {},
    authHeader()
  );
};

// ------------------------------ Products -------------------------
export const getAllProducts = async () => {
  return await axios.get(`${API_BASE_URL}/admin/products/`, authHeader());
}

export const getProductById = async (id) => {
  return await axios.get(`${API_BASE_URL}/admin/products/${id}`, authHeader());
}

export const activateProduct = async (id) => {
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