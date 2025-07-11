import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EchoUser {
  name: string;
  avatar: string;
  reaction: string;
}

interface ReactionType {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  hoverColor: string;
  bgColor: string;
  sound: string;
  animation: { scale: number; rotate?: number[] };
}

interface EchoedByModalProps {
  open: boolean;
  onClose: () => void;
  echoUsers: EchoUser[];
  reactions: ReactionType[];
  selectedReaction?: string | null;
}

const MAX_USERS_DISPLAYED = 50;

// EchoedByModal.tsx
// Modal for displaying all users who echoed an ink, with reaction filters and accessibility. Responsive and scrollable. For future: Add pagination, search, or more advanced filters for very large datasets.
const EchoedByModal: React.FC<EchoedByModalProps> = ({ open, onClose, echoUsers, reactions, selectedReaction = null }) => {
  const [filter, setFilter] = useState<string | null>(selectedReaction);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  // Filter users by selected reaction
  const filteredUsers = filter
    ? echoUsers.filter((u: EchoUser) => u.reaction === filter)
    : echoUsers;
  const usersToShow = filteredUsers.slice(0, MAX_USERS_DISPLAYED);
  const moreCount = filteredUsers.length - usersToShow.length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-purple-100/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 relative border border-purple-100"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button */}
            <button
              className="absolute top-2.5 right-2.5 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-purple-600 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full bg-white shadow"
              onClick={onClose}
              aria-label="Close echo list"
              tabIndex={0}
              type="button"
            >
              ×
            </button>
            {/* Title and count */}
            <div className="mb-2 pt-5 pb-2 px-4 sm:px-6 flex items-center gap-2 border-b border-purple-100">
              <span className="font-semibold text-base sm:text-lg text-gray-800">Echoed by</span>
              <span className="text-xs sm:text-sm text-gray-500">{filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}</span>
            </div>
            {/* Reaction filter tabs (icons only) */}
            <div className="flex gap-2 px-4 sm:px-6 py-2 border-b border-purple-50 bg-purple-50/40">
              <button
                className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-150 ${filter === null ? "bg-white border-purple-300 ring-2 ring-purple-200" : "border-transparent hover:bg-white/60"}`}
                onClick={() => setFilter(null)}
                aria-label="Show all reactions"
                title="All"
              >
                <span className="text-gray-400 text-lg font-bold">•</span>
              </button>
              {reactions.map((r: ReactionType) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-150 ${filter === r.id ? `bg-white border-purple-400 ring-2 ring-purple-300 ${r.color}` : `border-transparent ${r.color} hover:bg-white/60`}`}
                    onClick={() => setFilter(r.id)}
                    aria-label={`Show ${r.label} echoes`}
                    title={r.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
            {/* User list */}
            <div className="max-h-64 sm:max-h-80 overflow-y-auto divide-y divide-gray-100 px-4 sm:px-6 py-2 custom-scrollbar">
              {usersToShow.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm sm:text-base">No echoes for this reaction yet.</div>
              ) : (
                usersToShow.map((u: EchoUser, idx: number) => {
                  const reaction = reactions.find((r: ReactionType) => r.id === u.reaction);
                  const ReactionIcon = reaction?.icon;
                  return (
                    <div key={u.name + idx} className="flex items-center gap-3 py-2">
                      <img src={u.avatar} alt={u.name} className="w-8 sm:w-9 h-8 sm:h-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                      <span className="font-medium text-xs sm:text-sm text-gray-800 flex-1 truncate">{u.name}</span>
                      {ReactionIcon && (
                        <span className={`flex items-center gap-1 ${reaction.color}`} title={reaction.label} aria-label={reaction.label}>
                          <ReactionIcon className="w-5 h-5" />
                        </span>
                      )}
                    </div>
                  );
                })
              )}
              {moreCount > 0 && (
                <div className="text-center text-xs sm:text-sm text-gray-400 py-2">And {moreCount} more echo{moreCount > 1 ? "es" : ""}...</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Custom scrollbar styles (add to your global CSS if not present)
// .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background: #a78bfa; border-radius: 8px; }
// .custom-scrollbar::-webkit-scrollbar-track { background: #f3e8ff; border-radius: 8px; }
// .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #a78bfa #f3e8ff; }

export default EchoedByModal; 