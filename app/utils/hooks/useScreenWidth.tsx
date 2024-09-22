import { useEffect, useState } from "react";

export default function useScreenWidth() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return isMobile;
}
