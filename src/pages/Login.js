// File: src/pages/Login.js
function Login() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">Login to BrandHub</h2>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md" />
        <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md" />
        <button className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account? <a href="/signup" className="text-pink-600 underline">Sign up</a>
      </p>
    </div>
  );
}

export default Login;
