import React from 'react';
import { UserBadge, VerifiedTick } from './user-badges';

export function BadgeDemo() {
  const demoUsers = [
    { name: 'sarah_mitchell', type: 'creator' as const, content: 'The creator of this amazing platform' },
    { name: 'alex_thompson', type: 'admin' as const, content: 'Platform administrator with full access' },
    { name: 'mike_rodriguez', type: 'moderator' as const, content: 'Community moderator keeping things safe' },
    { name: 'emma_wilson', type: 'contributor' as const, content: 'Regular contributor with verified status' },
    { name: 'david_chen', type: 'writer' as const, content: 'Published writer with verified tick' },
    { name: 'lisa_park', type: 'author' as const, content: 'Established author with verified status' },
    { name: 'jessica_brown', type: 'verified' as const, content: 'User with verified tick only' },
    { name: 'john_doe', type: 'none' as const, content: 'Regular user with no special badges' },
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">User Badge Demo</h2>
      <div className="space-y-4">
        {demoUsers.map((user) => (
          <div key={user.name} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{user.name}</span>
              {user.type !== 'none' && user.type !== 'verified' && (
                <UserBadge type={user.type} />
              )}
              {user.type === 'verified' && <VerifiedTick />}
            </div>
            <span className="text-sm text-gray-600 ml-2">{user.content}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-white rounded-lg">
        <h3 className="font-semibold mb-2">Badge Types:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><UserBadge type="creator" /> - Platform Creator</div>
          <div><UserBadge type="admin" /> - Administrator</div>
          <div><UserBadge type="moderator" /> - Moderator</div>
          <div><UserBadge type="contributor" /> - Contributor</div>
          <div><UserBadge type="writer" /> - Writer</div>
          <div><UserBadge type="author" /> - Author</div>
          <div><VerifiedTick /> - Verified User</div>
        </div>
      </div>
    </div>
  );
} 

// TODO: Connect to backend API for real-time updates and data validation.
// TODO: Implement optimistic UI with rollback on error.
// TODO: Add backend-side rate limiting and abuse prevention. 