import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Contact Info */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-600" />
                <p className="text-gray-700">
                  123 ABC Street, District 1, Ho Chi Minh City
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-orange-600" />
                <p className="text-gray-700">(+84) 123 456 789</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-orange-600" />
                <p className="text-gray-700">support@shopdino.vn</p>
              </div>

              <p className="text-gray-500 text-sm mt-6">
                Working hours:{" "}
                <span className="text-gray-700">
                  Mon – Sat, 8:00 AM – 6:00 PM
                </span>
              </p>
            </div>

            {/* Contact Form */}
            <form
              className="flex-1 bg-gray-50 p-6 rounded-xl shadow-sm space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
