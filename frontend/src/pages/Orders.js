import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../api/admin';
import { brandApi } from '../api/brand';
import { customerApi } from '../api/customer';
import { FaTimes, FaCheck, FaTruck, FaBoxOpen } from 'react-icons/fa';

function Orders() {
  const { userType, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      switch (userType) {
        case 'admin':
          response = await adminApi.getAllOrders();
          break;
        case 'brand':
          response = await brandApi.getAllOrders();
          break;
        default:
          response = await customerApi.getCustomerOrders();
      }
      
      setOrders(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userType]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, userType, fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      if (userType === 'admin') {
        await adminApi.updateOrderStatus(orderId, newStatus);
      } else if (userType === 'brand') {
        await brandApi.updateOrderStatus(orderId, newStatus);
      }
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      if (userType === 'customer') {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to cancel order', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'cancelled': return <FaTimes className="mr-1" />;
      case 'delivered': return <FaCheck className="mr-1" />;
      case 'shipped': return <FaTruck className="mr-1" />;
      default: return <FaBoxOpen className="mr-1" />;
    }
  };

  const getPageTitle = () => {
    switch (userType) {
      case 'admin': return 'All Orders';
      case 'brand': return 'Your Brand Orders';
      default: return 'My Orders';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading orders...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{getPageTitle()}</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              {userType === 'admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
              )}
              {userType !== 'brand' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order._id.slice(-6)}
                </td>
                {userType === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer?.name || 'N/A'}
                  </td>
                )}
                {userType !== 'brand' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.brand?.name || 'N/A'}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(order.total || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {['admin', 'brand'].includes(userType) ? (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="border rounded p-1 text-sm"
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : order.status === 'pending' ? (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Cancel
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;