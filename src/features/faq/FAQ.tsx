import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const faqs = [
    {
      category: "Orders & Shipping",
      items: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 3-5 business days. Express shipping delivers within 1-2 business days.",
        },
        {
          q: "Do you offer international shipping?",
          a: "Currently, we only ship within the United States.",
        },
        {
          q: "What are the shipping costs?",
          a: "Standard shipping is $5.99 for orders under $50. Free shipping for orders over $50.",
        },
        {
          q: "Can I track my order?",
          a: "Yes! You'll receive a tracking number via email once your order ships.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      items: [
        {
          q: "What is your return policy?",
          a: "30-day returns for unworn shoes in original packaging. Full refund or exchange available.",
        },
        {
          q: "How do I start a return?",
          a: "Go to Order History in your account and click 'Start Return'. You'll receive a prepaid label within 24 hours.",
        },
        {
          q: "Are returns free?",
          a: "Yes! We provide a free prepaid return label.",
        },
        {
          q: "When will I receive my refund?",
          a: "Refunds are processed within 2-3 business days and appear in 5-7 business days.",
        },
      ],
    },
    {
      category: "Products & Sizing",
      items: [
        {
          q: "How do I find my shoe size?",
          a: "Check the size chart on each product page. If between sizes, we recommend sizing up.",
        },
        {
          q: "Are all products authentic?",
          a: "Yes! All products are sourced directly from authorized distributors with authenticity guarantee.",
        },
        {
          q: "Do you restock sold-out items?",
          a: "Yes, sign up for restock notifications by clicking 'Notify Me When Available' on the product page.",
        },
      ],
    },
    {
      category: "Payment & Account",
      items: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay.",
        },
        {
          q: "Is my payment secure?",
          a: "Yes! We use SSL encryption to protect your payment information.",
        },
        {
          q: "Do I need an account to purchase?",
          a: "No, but an account lets you track orders, save addresses, and manage returns easily.",
        },
      ],
    },
  ];

  const toggle = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {faqs.map((category, catIdx) => (
          <div key={catIdx} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.items.map((item, itemIdx) => {
                const idx = `${catIdx}-${itemIdx}`;
                const isOpen = openIndex === idx;

                return (
                  <div
                    key={itemIdx}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
                  >
                    <button
                      onClick={() => toggle(idx)}
                      className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-orange-50 transition-colors"
                    >
                      <span className="text-left font-semibold text-gray-800">
                        {item.q}
                      </span>
                      {isOpen ? (
                        <FaChevronUp className="text-orange-500 flex-shrink-0 ml-4" />
                      ) : (
                        <FaChevronDown className="text-orange-500 flex-shrink-0 ml-4" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          Still Have Questions?
        </h2>
        <p className="text-gray-600 mb-6">Our support team is here to help</p>
        <a href="/contact">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-500 transition-all duration-300 shadow-md hover:shadow-orange-500/30">
            Contact Support
          </button>
        </a>
      </div>
    </div>
  );
}
