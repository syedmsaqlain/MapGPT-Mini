export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow-md fixed w-full top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-blue-600">🌍 MyCompany</h1>
          <nav className="space-x-6">
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#services" className="hover:text-blue-600">Services</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center px-6">
        <div>
          <h2 className="text-5xl font-bold mb-4">Welcome to MyCompany</h2>
          <p className="text-lg mb-6">We build AI, ML & Agentic AI solutions for the future 🚀</p>
          <a href="#services" className="bg-white text-blue-600 px-6 py-3 rounded-full shadow-md hover:bg-gray-200">
            Explore Services
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-5xl mx-auto py-20 px-6">
        <h3 className="text-3xl font-bold mb-4 text-center">About Us</h3>
        <p className="text-center text-gray-600">
          We are a forward-thinking company specializing in <b>Machine Learning</b>, 
          <b> Generative AI</b>, and <b>Agentic AI</b> solutions. Our mission is to 
          create intelligent applications that empower businesses and individuals alike.
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-100 py-20 px-6">
        <h3 className="text-3xl font-bold mb-8 text-center">Our Services</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">🤖 AI Agents</h4>
            <p>Custom agentic AI for business automation, customer support, and workflow optimization.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">📊 Machine Learning</h4>
            <p>Predictive models for data analysis, forecasting, and optimization problems.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">🎨 Generative AI</h4>
            <p>AI solutions that generate text, images, and ideas for innovation and creativity.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-5xl mx-auto py-20 px-6 text-center">
        <h3 className="text-3xl font-bold mb-6">Contact Us</h3>
        <p className="mb-6 text-gray-600">Have a project in mind? Let's collaborate!</p>
        <form className="max-w-md mx-auto space-y-4">
          <input type="text" placeholder="Your Name" className="w-full border p-3 rounded-lg" />
          <input type="email" placeholder="Your Email" className="w-full border p-3 rounded-lg" />
          <textarea placeholder="Your Message" className="w-full border p-3 rounded-lg h-32"></textarea>
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <p>© {new Date().getFullYear()} MyCompany. All rights reserved.</p>
      </footer>
    </div>
  );
}
