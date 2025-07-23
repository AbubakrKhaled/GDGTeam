import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem("accessToken");


// ------------------------------ Brands -------------------------
export const getAllBrands = async () => {
  return await axios.get(`${API_BASE_URL}/admin/brands/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const getBrandById = async (id) => {
  return await axios.get(`${API_BASE_URL}/admin/brands/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const brandApproval = async (id, isApproved) => {
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/approve`,
    { isApproved },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const activateBrand = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const deactivateBrand = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/brands/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

// ------------------------------ Customer -------------------------
export const getAllCustomers = async () => {
  return await axios.get(`${API_BASE_URL}/admin/customers/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const getCustomerById = async (id) => {
  return await axios.get(`${API_BASE_URL}/admin/customers/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const activateCustomer = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/customers/${id}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const deactivateCustomer = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/customers/${id}/deactivate`,
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
  return await axios.get(`${API_BASE_URL}/admin/orders/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const getOrderById = async (id) => {
  return await axios.get(`${API_BASE_URL}/admin/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const updateOrderStatus = async (id, status) => {
  return await axios.put(
    `${API_BASE_URL}/admin/orders/${id}/status`,
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
    `${API_BASE_URL}/admin/brands/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

// ------------------------------ Customer -------------------------
export const getAllProducts = async () => {
  return await axios.get(`${API_BASE_URL}/admin/products/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const getProductById = async (id) => {
  return await axios.get(`${API_BASE_URL}/admin/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export const activateProduct = async (id) => {
  return await axios.put(
    `${API_BASE_URL}/admin/products/${id}/activate`,
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
    `${API_BASE_URL}/admin/products/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};
