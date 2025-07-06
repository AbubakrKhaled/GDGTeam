// src/components/SearchBar.js
function SearchBar() {
  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Search for products or brands..."
        className="w-full max-w-lg px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}
export default SearchBar;
