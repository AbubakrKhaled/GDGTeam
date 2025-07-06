// src/components/Modal.js
import { useState } from 'react';

function Modal() {
  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
        <h3 className="text-xl font-semibold mb-2">🎉 Special Offer</h3>
        <p className="text-gray-600 mb-4">Free shipping on first orders above 500 EGP.</p>
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          onClick={() => setIsOpen(false)}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
export default Modal;
