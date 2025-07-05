// File: src/pages/Signup.js
function Signup() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">Create Your Account</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded-md" />
        <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md" />
        <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md" />
        <button className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account? <a href="/login" className="text-pink-600 underline">Login</a>
      </p>
    </div>
  );
}

export default Signup;
