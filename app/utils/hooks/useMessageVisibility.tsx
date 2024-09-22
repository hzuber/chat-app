// import { MutableRefObject, useEffect } from "react";

// // Custom hook to observe visibility of elements (e.g., chat messages)
// export const useMessageVisibility = (
//   messageRefs: MutableRefObject<(HTMLDivElement | null)[]>,
//   onMessageVisible: (messageId: string) => void
// ) => {
//   const currentRefs = messageRefs.current;
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const messageId = entry.target.getAttribute("data-message-id");
//             messageId && onMessageVisible(messageId);
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );
//     console.log("messageRefs", messageRefs);
//     if (messageRefs && currentRefs) {
//       currentRefs.forEach((ref) => ref && observer.observe(ref));
//     }

//     return () => {
//       messageRefs &&
//         currentRefs?.forEach((ref) => {
//           if (ref) {
//             observer.unobserve(ref);
//           }
//         });
//     };
//   }, [currentRefs, messageRefs, onMessageVisible]);
// };
