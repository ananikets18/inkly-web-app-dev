"use client";

import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface EchoUser {
  name: string;
  avatar: string;
}

interface EchoPileProps {
  users: EchoUser[];
  total: number;
  poetic?: boolean;
}

export default function EchoPile({ users, total, poetic = false }: EchoPileProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (total === 0) return null;

  const displayedUsers = users.slice(0, 3);
  const remaining = Math.max(0, total - displayedUsers.length);

  const tooltipText =
    displayedUsers.length === 1
      ? `Echoed by ${displayedUsers[0].name}`
      : `Echoed by ${displayedUsers.map((u) => u.name).join(", ")}${
          remaining > 0 ? ` and ${remaining} others` : ""
        }`;

  const AvatarList = (
    <div className="flex -space-x-1.5">
      {displayedUsers.map((user, i) => (
        <motion.img
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          src={user.avatar}
          alt={user.name}
          className="w-5 h-5 rounded-full border-2 border-white shadow-sm object-cover"
        />
      ))}
    </div>
  );

  return (
    <div className="text-xs text-gray-500 cursor-default">
      {isMobile ? (
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-2">
            {AvatarList}
            <span className="font-medium">{total} Echo{total > 1 ? "es" : ""}</span>
          </div>
          <span className="text-[11px] text-gray-400 pl-0.5">{tooltipText}</span>
        </div>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {AvatarList}
              <span className="font-medium">{total} Echo{total > 1 ? "es" : ""}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
