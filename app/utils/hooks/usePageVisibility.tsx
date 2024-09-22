// import { useEffect } from "react";

// // Custom hook to detect if the window is focused and visible
// export const usePageVisibility = (onVisible: () => void) => {
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         onVisible();
//       }
//     };

//     const handleFocus = () => {
//       onVisible();
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("focus", handleFocus);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("focus", handleFocus);
//     };
//   }, [onVisible]);
// };
