function BrandDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Seller Dashboard</h2>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Upload New Product</h3>
        <input className="w-full p-2 mb-3 border rounded" placeholder="Product Name" />
        <input className="w-full p-2 mb-3 border rounded" placeholder="Price" />
        <textarea className="w-full p-2 mb-3 border rounded" rows={3} placeholder="Description"></textarea>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Upload</button>
      </div>
    </div>
  );
}

export default BrandDashboard;
