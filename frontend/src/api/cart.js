import axios from "axios";

/*
axios.HTTPMETHOD(url, [data], { headers }).
POST/PUT need data. GET/DELETE do not.
*/

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem("accessToken");

export const getCart = async () => {
  return await axios.get(`${API_BASE_URL}/cart/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

//-------------------------------------------------------------------------------------------
export const getWishlist = async () => {
    return await axios.get(`${API_BASE_URL}/cart/wishlist`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
};

export const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      throw err; //for UI
      }
};

export const deleteWishlistProduct = async (productId) => {
    return await axios.delete(`${API_BASE_URL}/cart/wishlist/${productId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

//-------------------------------------------------------------------------------------------------
export const addToCartFromWishlist = async (productId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/cart/addToCartFromWishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error adding product to cart from wishlist:", err);
      throw err; //for UI
      }
};

export const addToCart = async (productId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
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
        {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const deleteCartProduct = async (productId) => {
    return await axios.delete(`${API_BASE_URL}/cart/${productId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

const cartApi = {
  getCart,
  getWishlist,
  addToWishlist,
  deleteWishlistProduct,
  addToCartFromWishlist,
  addToCart,
  updateCartProductAmount,
  deleteCartProduct,
};

export { cartApi };
