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

//--------------------------------------------------------------------------------------


export const getAllProducts = async () => {
  return await axios.get(`${API_BASE_URL}/products/`, authHeader());
}

export const getProductById = async (productId) => {
    return await axios.get(`${API_BASE_URL}/products/${productId}`, authHeader());
};


const productApi = {
    getAllProducts,
    getProductById
};

export { productApi };