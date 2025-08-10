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

//--------------------------------------------------------------------------------------


export const getOrders = async () => {
  return await axios.get(`${API_BASE_URL}/order/`, authHeader());
}

export const getOrderHistory = async () => {
    return await axios.get(`${API_BASE_URL}/order/history`, authHeader());
};

export const getOrderById = async (orderId) => {
    return await axios.get(`${API_BASE_URL}/order/${orderId}`, authHeader());
};

//-------------------------------------------------------------------------------------------------
export const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/order/status/${orderId}`,
        { status },
        authHeader()
      );
      return response.data;
    } catch (err) {
      console.error("Error updating order status", err);
      throw err;
      }
};

export const deactivateOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/order/cancel/${orderId}`,
        {},
        authHeader()
      );
      return response.data;
    } catch (err) {
      console.error("Error cancelling order:", err);
      throw err;
      }
};

export const checkoutOrder = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/order/checkout`,
        {},
        authHeader()
      );
      return response.data;
    } catch (err) {
      console.error("Error checking out:", err);
      throw err;
    }
  };
