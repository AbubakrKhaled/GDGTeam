//About.js
import { 
  FaHandshake, 
  FaUserShield, 
  FaRocket, 
  FaUser,
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About BrandHub</h1>
      
      <section className="mb-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Where Brands and Shoppers Connect</h2>
          <p className="text-lg mb-6">
            BrandHub is revolutionizing the e-commerce experience by creating a dynamic marketplace that brings together passionate shoppers with innovative brands.
          </p>
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <p className="font-medium">
              "Our mission is to empower brands of all sizes while providing customers with an exceptional shopping experience that combines convenience, discovery, and quality."
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="mb-4">
              Founded in 2025, BrandHub began as a small team of e-commerce enthusiasts who saw an opportunity to create a more balanced marketplace. We noticed that while large retailers dominated online shopping, smaller brands struggled to get visibility.
            </p>
            <p className="mb-4">
              What started as a passion project has grown into a thriving platform supporting hundreds of brands and serving thousands of customers worldwide. Our growth has been fueled by our commitment to fair practices, innovative features, and exceptional customer service.
            </p>
            <p>
              Today, BrandHub stands as a testament to what's possible when technology meets a genuine desire to create positive change in e-commerce.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-2xl font-bold text-pink-600">500+</p>
                <p className="text-sm">Brands Supported</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-2xl font-bold text-purple-600">10K+</p>
                <p className="text-sm">Happy Customers</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-2xl font-bold text-pink-600">24/7</p>
                <p className="text-sm">Customer Support</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-2xl font-bold text-purple-600">100%</p>
                <p className="text-sm">Secure Checkout</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-2xl font-bold text-pink-600">30+</p>
                <p className="text-sm">Categories</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-2xl font-bold text-purple-600">1M+</p>
                <p className="text-sm">Products Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">What Makes Us Different</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="text-pink-600 text-3xl mb-4">
              <FaHandshake />
            </div>
            <h3 className="font-semibold text-lg mb-2">Brand-First Approach</h3>
            <p>
              We give brands the tools they need to succeed with our comprehensive dashboard, analytics, and fair commission structure.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="text-purple-600 text-3xl mb-4">
              <FaUserShield />
            </div>
            <h3 className="font-semibold text-lg mb-2">Customer Protection</h3>
            <p>
              Our robust buyer protection program ensures you shop with confidence, with easy returns and secure payments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="text-pink-600 text-3xl mb-4">
              <FaRocket />
            </div>
            <h3 className="font-semibold text-lg mb-2">Innovative Features</h3>
            <p>
              From advanced search to personalized recommendations, we're constantly evolving to enhance your shopping experience.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Team</h2>
        <p className="text-center mb-8 max-w-2xl mx-auto">
          BrandHub is powered by a diverse team of e-commerce experts, tech innovators, and customer service professionals who are passionate about creating the best possible platform for both shoppers and brands.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: 'Mohamed Saeed', role: 'Founder & CEO', bio: 'E-commerce veteran with 10+ years experience building online marketplaces.' },
            { name: 'Shahd Mostafa', role: 'CTO', bio: 'Tech innovator specializing in scalable e-commerce platforms.' },
            { name: 'Kareem Yasser', role: 'Head of Brand Relations', bio: 'Connects emerging brands with the right audience.' },
            { name: 'Doha Maged', role: 'Customer Experience', bio: 'Ensures every shopper has an exceptional journey.' }
          ].map((member, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <FaUser className="text-4xl text-gray-400 mx-auto mt-6" />
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-pink-600 text-sm mb-2">{member.role}</p>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Join Our Community</h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="mb-6 text-lg">
            Whether you're a shopper looking for unique products or a brand ready to grow, we'd love to have you as part of the BrandHub family.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Shop Now
            </button>
            <button className="px-6 py-3 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors">
              List Your Brand
            </button>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Stay Connected</h2>
        <div className="flex justify-center space-x-6 mb-6">
          <a 
            href="https://facebook.com/brandhub" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-600 hover:text-pink-800 text-2xl"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a 
            href="https://instagram.com/brandhub" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-600 hover:text-pink-800 text-2xl"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a 
            href="https://twitter.com/brandhub" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-600 hover:text-pink-800 text-2xl"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a 
            href="https://linkedin.com/company/brandhub" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-600 hover:text-pink-800 text-2xl"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
        <p className="text-gray-600">
          Have questions? Contact us at <a href="mailto:hello@brandhub.com" className="text-pink-600 hover:underline">hello@brandhub.com</a>
        </p>
      </section>
    </div>
  );
}

export default About;