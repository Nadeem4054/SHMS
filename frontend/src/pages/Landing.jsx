import { Link } from 'react-router-dom';
import { 
  FaBed, 
  FaWifi, 
  FaShieldAlt, 
  FaUtensils, 
  FaCheckCircle,
  FaClock,
  FaBook,
  FaMedkit
} from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Smart Hostel Management System
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience comfortable living with modern amenities and seamless management. 
              Your home away from home.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/apply" 
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Apply Now
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Smart Hostel?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best living experience for students with modern facilities and 24/7 support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FaWifi className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">High-Speed WiFi</h3>
              <p className="text-gray-600">24/7 high-speed internet access for all your study needs.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FaShieldAlt className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">24/7 Security</h3>
              <p className="text-gray-600">Round-the-clock security with CCTV surveillance.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FaUtensils className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mess Facility</h3>
              <p className="text-gray-600">Nutritious meals with vegetarian and non-vegetarian options.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FaBook className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Study Rooms</h3>
              <p className="text-gray-600">Dedicated quiet study spaces for focused learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hostel Rules Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hostel Rules & Regulations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              To ensure a safe and comfortable environment for all residents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Gate Closing Time</h3>
                <p className="text-gray-600">Main gate closes at 10:00 PM. Late entry requires prior permission.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Visitor Policy</h3>
                <p className="text-gray-600">Visitors allowed only in common areas during visiting hours (4 PM - 8 PM).</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">No Smoking/Alcohol</h3>
                <p className="text-gray-600">Strictly prohibited within hostel premises. Violation leads to immediate termination.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Room Maintenance</h3>
                <p className="text-gray-600">Keep your room clean. Weekly inspections are conducted.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Electrical Appliances</h3>
                <p className="text-gray-600">Only allowed appliances: laptop, mobile charger, and electric kettle.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Noise Levels</h3>
                <p className="text-gray-600">Maintain silence during study hours (9 PM - 6 AM).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Facilities Section */}
      <section id="rooms" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Room Facilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comfortable rooms equipped with all essential amenities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-primary-100 flex items-center justify-center">
                <FaBed className="text-6xl text-primary-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2-Seater Room</h3>
                <p className="text-gray-600 mb-4">Perfect for students who prefer more privacy.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />2 Single Beds</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />2 Study Tables</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />2 Wardrobes</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />Attached Bathroom</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-primary-100 flex items-center justify-center">
                <FaBed className="text-6xl text-primary-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3-Seater Room</h3>
                <p className="text-gray-600 mb-4">Balanced option for comfort and affordability.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />3 Single Beds</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />3 Study Tables</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />3 Wardrobes</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />Attached Bathroom</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-primary-100 flex items-center justify-center">
                <FaBed className="text-6xl text-primary-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4-Seater Room</h3>
                <p className="text-gray-600 mb-4">Economical choice with shared facilities.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />4 Single Beds</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />4 Study Tables</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />4 Wardrobes</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" />Shared Bathroom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                Have questions? Get in touch with us.
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Message subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <FaBed className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold">Smart Hostel</span>
              </div>
              <p className="text-gray-400 text-sm">
                Providing comfortable and secure accommodation for students since 2010.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/#rooms" className="hover:text-white transition-colors">Rooms</Link></li>
                <li><Link to="/apply" className="hover:text-white transition-colors">Apply Now</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Facilities</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center"><FaWifi className="mr-2" /> WiFi</li>
                <li className="flex items-center"><FaMedkit className="mr-2" /> Medical</li>
                <li className="flex items-center"><FaClock className="mr-2" /> 24/7 Security</li>
                <li className="flex items-center"><FaUtensils className="mr-2" /> Mess</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>123 University Road</li>
                <li>City, State 12345</li>
                <li>Phone: +1 (123) 456-7890</li>
                <li>Email: info@smarthostel.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Smart Hostel Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
