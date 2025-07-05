// src/components/CartDrawer.js
function CartDrawer() {
  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg p-4 border w-64">
      <h2 className="text-lg font-semibold mb-2">Cart (0 items)</h2>
      <p className="text-sm text-gray-500">Add items to cart to view them here.</p>
    </div>
  );
}
export default CartDrawer;
