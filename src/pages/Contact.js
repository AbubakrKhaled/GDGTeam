function Contact() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <p className="mb-4 text-gray-600">Got a question or a suggestion? We'd love to hear from you.</p>
      <input className="w-full p-2 mb-4 border rounded" placeholder="Your Email" />
      <textarea className="w-full p-2 mb-4 border rounded" rows="4" placeholder="Your Message"></textarea>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Send</button>
    </div>
  );
}

export default Contact;
