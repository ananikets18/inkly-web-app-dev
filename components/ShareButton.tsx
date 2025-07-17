// "use client"

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button"
// import ToastPortal from "./ToastPortal"
// import {
//   Copy,
//   Linkedin,
//   Twitter,
//   Share2,
//   Send,
//   CheckCircle,
// } from "lucide-react"
// import { useEffect, useState } from "react"

// export default function ShareButton({  url, onShared }: {  url: string; onShared?: () => void }) {
//   const [showToast, setShowToast] = useState(false)
//   const [isCopyLocked, setIsCopyLocked] = useState(false)
//   const encodedURL = encodeURIComponent(url || window.location.href)

//   const handleShare = (platform: string) => {
//     const links: Record<string, string> = {
//       twitter: `https://twitter.com/intent/tweet?url=${encodedURL}`,
//       linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}`,
//       whatsapp: `https://api.whatsapp.com/send?text=${encodedURL}`,
//     }

//     if (platform === "copy") {
//       if (isCopyLocked) return // 🚫 Prevent spam tap
//       navigator.clipboard.writeText(url || window.location.href)
//       setShowToast(true)
//       onShared?.() // trigger callback
//         const audio = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zip-blob/inkly_ui/public/sound/share_blip-smvg7yYNNcoep8wBCdTgCNbunZHcKQ.mp3")
//         audio.volume = 0.3 // adjust for subtle feedback
//         audio.play()
//          setIsCopyLocked(true)
//         setTimeout(() => setIsCopyLocked(false), 3000) // ⏳ unlock after 3s

//     } else {
//       window.open(links[platform], "_blank")
      
//     }
//   }

//   // Auto-hide toast
//   useEffect(() => {
//     if (showToast) {
//       const timeout = setTimeout(() => setShowToast(false), 3000)
//       return () => clearTimeout(timeout)
//     }
//   }, [showToast])

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-gray-500 hover:text-blue-600 w-8 h-8"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Share2 className="w-4 h-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           onClick={(e) => e.stopPropagation()}
//           align="end"
//           className="w-48 z-50"
//         >
//           <DropdownMenuItem
//             onClick={(e) => {
//               e.stopPropagation()
//               handleShare("copy")
//             }}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <Copy className="w-4 h-4 text-gray-600" />
//             <span>Copy Link</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={(e) => {
//               e.stopPropagation()
//               handleShare("twitter")
//             }}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <Twitter className="w-4 h-4 text-[#1DA1F2]" />
//             <span>Share on X</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={(e) => {
//               e.stopPropagation()
//               handleShare("linkedin")
//             }}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <Linkedin className="w-4 h-4 text-[#0077B5]" />
//             <span>LinkedIn</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={(e) => {
//               e.stopPropagation()
//               handleShare("whatsapp")
//             }}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <Send className="w-4 h-4 text-green-500" />
//             <span>WhatsApp</span>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* 🔔 Toast Notification */}
//         {showToast && (
//         <ToastPortal>
//             <div className="fixed bottom-6 right-6 z-[9999] bg-white border rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 animate-fade-in-up">
//             <CheckCircle className="w-5 h-5 text-green-500" />
//             <span className="text-sm text-gray-800">Ink link copied to clipboard!</span>
//             </div>
//         </ToastPortal>
//         )}

//     </>
//   )
// }

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  inkId: string;
}

export default function ShareButton({ inkId }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this ink!",
        url: `${window.location.origin}/ink/${inkId}`,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/ink/${inkId}`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="text-gray-600 hover:text-gray-900"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-1"
      >
        <path
          d="M12 5.33333C13.1046 5.33333 14 4.43791 14 3.33333C14 2.22876 13.1046 1.33333 12 1.33333C10.8954 1.33333 10 2.22876 10 3.33333C10 4.43791 10.8954 5.33333 12 5.33333Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 10C5.10457 10 6 9.10457 6 8C6 6.89543 5.10457 6 4 6C2.89543 6 2 6.89543 2 8C2 9.10457 2.89543 10 4 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 14.6667C13.1046 14.6667 14 13.7713 14 12.6667C14 11.5621 13.1046 10.6667 12 10.6667C10.8954 10.6667 10 11.5621 10 12.6667C10 13.7713 10.8954 14.6667 12 14.6667Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.72667 9.00667L10.28 11.66"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.2733 4.34L5.72667 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Share
    </Button>
  );
}
