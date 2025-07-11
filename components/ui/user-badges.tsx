import React from 'react';

interface UserBadgeProps {
  type: 'creator' | 'admin' | 'moderator' | 'contributor' | 'writer' | 'author';
  className?: string;
}

interface AvatarBadgeProps {
  type: 'creator' | 'admin' | 'moderator' | 'contributor' | 'writer' | 'author';
  className?: string;
}

const badgeConfig = {
  creator: {
    label: 'Creator',
    colors: 'bg-purple-100 text-purple-800 border-purple-200',
    avatarColors: 'bg-purple-500 text-white',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  admin: {
    label: 'Admin',
    colors: 'bg-red-100 text-red-800 border-red-200',
    avatarColors: 'bg-red-500 text-white',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    )
  },
  moderator: {
    label: 'Mod',
    colors: 'bg-blue-100 text-blue-800 border-blue-200',
    avatarColors: 'bg-blue-500 text-white',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  contributor: {
    label: 'Contributor',
    colors: 'bg-green-100 text-green-800 border-green-200',
    avatarColors: 'bg-green-500 text-white',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  writer: {
    label: 'Writer',
    colors: 'bg-orange-100 text-orange-800 border-orange-200',
    avatarColors: 'bg-orange-500 text-white',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    )
  },
  author: {
    label: 'Author',
    colors: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    avatarColors: 'bg-indigo-500 text-white',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    )
  }
};

export function UserBadge({ type, className = '' }: UserBadgeProps) {
  const config = badgeConfig[type];
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.colors} ${className}`} title={`${config.label} - Special community member`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export function AvatarBadge({ type, className = '' }: AvatarBadgeProps) {
  const config = badgeConfig[type];
  
  return (
    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${config.avatarColors} ${className}`} title={`${config.label} - Special community member`}>
      {config.icon}
    </div>
  );
}

export function VerifiedTick({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 text-purple-600 flex-shrink-0 ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-label="Verified">
      <title>Verified user</title>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );
}

// Helper function to convert username to display name
export function getDisplayName(username: string): string {
  return username
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to get user badge type
export function getUserBadgeType(author: string): 'creator' | 'admin' | 'moderator' | 'contributor' | 'writer' | 'author' | null {
  const badgeUsers: Record<string, 'creator' | 'admin' | 'moderator' | 'contributor' | 'writer' | 'author'> = {
    'sarah_mitchell': 'creator',
    'alex_thompson': 'admin',
    'mike_rodriguez': 'moderator',
    'emma_wilson': 'contributor',
    'david_chen': 'writer',
    'lisa_park': 'author'
  };
  
  return badgeUsers[author] || null;
}

// Helper function to check if user should get verified tick
export function shouldShowVerifiedTick(author: string): boolean {
  const verifiedUsers = ['emma_wilson', 'david_chen', 'lisa_park', 'jessica_brown', 'michael_lee'];
  return verifiedUsers.includes(author);
} 