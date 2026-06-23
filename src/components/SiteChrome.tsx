import { useLocation } from "react-router-dom";

import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";

function shouldHideSiteChrome(pathname: string) {
  return pathname === "/admin/login" || pathname === "/admin";
}

export default function SiteChrome() {
  const { pathname } = useLocation();

  if (shouldHideSiteChrome(pathname)) {
    return null;
  }

  return (
    <>
      <Footer />
      <BackToTop />
    </>
  );
}
