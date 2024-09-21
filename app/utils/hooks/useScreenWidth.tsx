import { useEffect, useState } from "react";

// Hook to check screen width
export default function useScreenWidth() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as necessary
    };

    checkScreenWidth(); // Check on load

    window.addEventListener("resize", checkScreenWidth);

    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return isMobile;
}
