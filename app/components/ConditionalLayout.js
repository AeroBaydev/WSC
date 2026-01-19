 "use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on quiz pages
  const isQuizPage = pathname?.startsWith("/quiz");
  
  return (
    <>
      {!isQuizPage && <Navbar />}
      {children}
      {!isQuizPage && <Footer />}
    </>
  );
}

