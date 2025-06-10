"use client";

import React from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-muted py-8 text-center text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm">
          © {currentYear} Pooller. All rights reserved.
        </p>
        <p className="text-sm mt-1">
          Contact: <a href="mailto:info@pooller.com" className="font-medium text-primary hover:underline">info@pooller.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
