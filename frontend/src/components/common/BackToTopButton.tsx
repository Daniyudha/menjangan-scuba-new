"use client";

import { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div>
      <button
        className={`fixed bottom-20 right-5 z-50 p-3 rounded-full cursor-pointer text-white bg-light-navy transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
        onClick={scrollToTop}
        aria-label="Go to top"
      >
        <ArrowUp size={24} />
      </button>
      <a
        href="https://wa.me/6282198984623?text=Halo%20Menjangan%20Scuba,%20saya%20ingin%20booking%20penyelaman."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 p-3 rounded-full cursor-pointer text-white bg-green-500 shadow hover:bg-green-600 transition-all duration-300">
        <MessageCircle></MessageCircle>
      </a>
    </div>
  );
};

export default BackToTopButton;