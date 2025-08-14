import axios from "axios";
//import product from '../../../backend/models/product';

/*
axios.HTTPMETHOD(url, [data], { headers }).
POST/PUT need data. GET/DELETE do not.
*/

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const getCart = async () => {
  return await axios.get(`${API_BASE_URL}/cart/`, authHeader());
}

//-------------------------------------------------------------------------------------------
export const getWishlist = async () => {
    return await axios.get(`${API_BASE_URL}/cart/wishlist`, authHeader());
};

export const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/wishlist/${productId}`,
        {},
        authHeader()
      );
      return response.data;
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      throw err;
      }
};

export const deleteWishlistProduct = async (productId) => {
    return await axios.delete(`${API_BASE_URL}/cart/wishlist/${productId}`, authHeader());
}

//-------------------------------------------------------------------------------------------------
export const addToCartFromWishlist = async (productId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/cart/addToCartFromWishlist/${productId}`,
        {},
        authHeader()
      );
      return response.data;
    } catch (err) {
      console.error("Error adding product to cart from wishlist:", err);
      throw err;
      }
};

export const addToCart = async (productId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/${productId}`,
        {},
        authHeader()
      );
      return response.data;
    } catch (err) {
      console.error("Error adding product to cart:", err);
      throw err;
    }
  };

  export const updateCartProductAmount = async (productId, quantity) => {
    return await axios.patch(`${API_BASE_URL}/cart/updateCartProductAmount/${productId}`, 
        {quantity:quantity},
        authHeader());
}

export const deleteCartProduct = async (productId) => {
    return await axios.delete(`${API_BASE_URL}/cart/${productId}`, authHeader());
}

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/order`,
      orderData,
      authHeader()
    );
    return response.data;
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
};

const cartApi = {
  getCart,
  getWishlist,
  addToWishlist,
  deleteWishlistProduct,
  addToCartFromWishlist,
  addToCart,
  updateCartProductAmount,
  deleteCartProduct,
  createOrder,
};

export { cartApi };
