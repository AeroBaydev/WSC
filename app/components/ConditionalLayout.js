 "use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

