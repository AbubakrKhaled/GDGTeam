import axios from "axios";

/*
axios.HTTPMETHOD(url, [data], { headers }).
POST/PUT need data. GET/DELETE do not.
*/

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem("accessToken");

// ------------------------------ Login --------------------------
export const brandLogin = async (username, password) => {
  return await axios.post(`${API_BASE_URL}/brand/login`, {
    username,
    password,
  });
};
//-------------------------------- singup ----------------------------
export const createBrand = async (brandData) => {
  return await axios.post(
    `${API_BASE_URL}/brand/signup`,
    brandData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};
// ------------------------------- Brands --------------------------

export const updateBrand = async (updatedBrandData) => {
  return await axios.put(
    `${API_BASE_URL}/brand/profile/update`,
    updatedBrandData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const getAllBrands = async () => {
  return await axios.get(`${API_BASE_URL}/brand/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}
export const getBrandById = async (id) => {
  return await axios.get(`${API_BASE_URL}/brand/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}
export const getBrandProfile = async () => {
  return await axios.get(`${API_BASE_URL}/brand/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

// ------------------------------ Products -------------------------
export const getAllProducts = async () => {
  return await axios.get(`${API_BASE_URL}/brand/products/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const getProductById = async (id) => {
  return await axios.get(`${API_BASE_URL}/brand/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
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
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const updateProduct = async (id, updatedProductData) => {
  return await axios.put(
    `${API_BASE_URL}/brand/products/${id}/update`,
    updatedProductData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const activateProduct = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/brand/products/${id}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const deactivateProduct = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/brand/products/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

// ------------------------------ Orders -------------------------
export const getAllOrders = async () => {
  return await axios.get(`${API_BASE_URL}/brand/orders/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const getOrderById = async (id) => {
  return await axios.get(`${API_BASE_URL}/brand/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const updateOrderStatus = async (id, status) => {
  return await axios.put(
    `${API_BASE_URL}/brand/orders/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const deactivateOrder = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/brand/orders/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};


const brandApi = {
  brandLogin,
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
