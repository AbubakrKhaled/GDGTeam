import { Link } from 'react-router-dom';

function ProductCard({ id, name, price }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <img src={`https://via.placeholder.com/300?text=${name}`} alt={name} className="rounded mb-3" />
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-gray-600 mb-2">{price} EGP</p>
      <Link to={`/products/${id}`} className="text-indigo-600 hover:underline">View Details</Link>
    </div>
  );
}

export default ProductCard;
