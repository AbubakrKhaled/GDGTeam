import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={`https://via.placeholder.com/400?text=Product+${id}`} className="rounded shadow" alt="product" />
      <div>
        <h1 className="text-3xl font-bold mb-3">Product Name {id}</h1>
        <p className="text-gray-600 mb-4">This is the product description. Stylish, clean, and comfortable.</p>
        <p className="text-xl font-semibold mb-4">400 EGP</p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductDetails;
