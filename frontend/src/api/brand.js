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

// ------------------------------ Login --------------------------
export const brandLogin = async (email, password) => {
  return await axios.post(`${API_BASE_URL}/brand/login`, {
    email,
    password,
  });
};

export const brandLogout = async () => {
  return await axios.post(`${API_BASE_URL}/brand/logout`, {}, authHeader());
};

//-------------------------------- singup ----------------------------
export const createBrand = async (brandData) => {
  return await axios.post(
    `${API_BASE_URL}/brand/signup`,
    brandData
  );
};
// ------------------------------- Brands --------------------------

export const updateBrand = async (updatedBrandData) => {
  return await axios.put(
    `${API_BASE_URL}/brand/profile/update`,
    updatedBrandData,
    authHeader()
  );
};

export const getAllBrands = async () => {
  return await axios.get(`${API_BASE_URL}/brand/`, authHeader());
}
export const getBrandById = async (id) => {
  return await axios.get(`${API_BASE_URL}/brand/${id}`, authHeader());
}
export const getBrandProfile = async (brandId) => {
  return await axios.get(`${API_BASE_URL}/brand/profile/${brandId}`, authHeader());
}

// ------------------------------ Products -------------------------
export const getAllProducts = async () => {
  return await axios.get(`${API_BASE_URL}/brand/products/`, authHeader());
}

export const getProductById = async (id) => {
  return await axios.get(`${API_BASE_URL}/brand/products/${id}`, authHeader());
}
/*
export const createProduct = async (productname, price, quantity, imageURL, description, category, color, size, discount) => {
  return await axios.post(`${API_BASE_URL}/brand/products/create`, {
    productname, price, quantity, imageURL, description, category, color, size, discount
  });
};
*/
export const createProduct = async (productData) => {
  return await axios.post(
    `${API_BASE_URL}/brand/products/create`,
    productData,
    authHeader()
  );
};

export const updateProduct = async (id, updatedProductData) => {
  return await axios.put(
    `${API_BASE_URL}/brand/products/${id}/update`,
    updatedProductData,
    authHeader()
  );
};

export const activateProduct = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/brand/products/${id}/activate`,
    {},
    authHeader()
  );
};

export const deactivateProduct = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/brand/products/${id}/deactivate`,
    {},
    authHeader()
  );
};

// ------------------------------ Orders -------------------------
export const getAllOrders = async () => {
  return await axios.get(`${API_BASE_URL}/brand/orders/`, authHeader());
}

export const getOrderById = async (id) => {
  return await axios.get(`${API_BASE_URL}/brand/orders/${id}`, authHeader());
}

export const updateOrderStatus = async (id, status) => {
  return await axios.put(
    `${API_BASE_URL}/brand/orders/${id}/status`,
    { status },
    authHeader()
  );
};

export const deactivateOrder = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/brand/orders/${id}/deactivate`,
    {},
    authHeader()
  );
};


const brandApi = {
  brandLogin,
  brandLogout,
  createBrand,
  updateBrand,
  getAllBrands,
  getBrandById,
  getBrandProfile,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deactivateOrder,
};

export { brandApi };
