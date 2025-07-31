// Route Protection Utility for Inkly
// Centralized management of route protection rules

export interface RouteProtection {
  path: string
  requiresAuth: boolean
  requiresOnboarding: boolean
  requiresRole?: string
  rateLimited?: boolean
  csrfProtected?: boolean
  contentValidation?: boolean
}

// Route protection configuration
export const ROUTE_PROTECTION: RouteProtection[] = [
  // Public Routes
  { path: '/', requiresAuth: false, requiresOnboarding: false },
  { path: '/about', requiresAuth: false, requiresOnboarding: false },
  { path: '/contact', requiresAuth: false, requiresOnboarding: false },
  { path: '/privacy', requiresAuth: false, requiresOnboarding: false },
  { path: '/terms', requiresAuth: false, requiresOnboarding: false },
  { path: '/help', requiresAuth: false, requiresOnboarding: false },
  { path: '/explore', requiresAuth: false, requiresOnboarding: false },
  { path: '/ink', requiresAuth: false, requiresOnboarding: false },

  // Auth Routes
  { path: '/auth/signin', requiresAuth: false, requiresOnboarding: false },
  { path: '/auth/signup', requiresAuth: false, requiresOnboarding: false },
  { path: '/auth/error', requiresAuth: false, requiresOnboarding: false },
  { path: '/auth/verify', requiresAuth: false, requiresOnboarding: false },
  { path: '/auth/reset', requiresAuth: false, requiresOnboarding: false },

  // Onboarding
  { path: '/onboarding', requiresAuth: true, requiresOnboarding: false },

  // Protected Routes (Auth Required)
  { path: '/account', requiresAuth: true, requiresOnboarding: false },
  { path: '/account/settings', requiresAuth: true, requiresOnboarding: false },
  { path: '/account/security', requiresAuth: true, requiresOnboarding: false },
  { path: '/account/privacy', requiresAuth: true, requiresOnboarding: false },
  { path: '/account/notifications', requiresAuth: true, requiresOnboarding: false },
  { path: '/account/billing', requiresAuth: true, requiresOnboarding: false },
  { path: '/account/subscription', requiresAuth: true, requiresOnboarding: false },
  { path: '/account/delete', requiresAuth: true, requiresOnboarding: false, csrfProtected: true },
  { path: '/preferences', requiresAuth: true, requiresOnboarding: false },
  { path: '/preferences/theme', requiresAuth: true, requiresOnboarding: false },
  { path: '/preferences/language', requiresAuth: true, requiresOnboarding: false },
  { path: '/preferences/notifications', requiresAuth: true, requiresOnboarding: false },
  { path: '/preferences/privacy', requiresAuth: true, requiresOnboarding: false },
  { path: '/support', requiresAuth: true, requiresOnboarding: false },
  { path: '/support/tickets', requiresAuth: true, requiresOnboarding: false },
  { path: '/support/help', requiresAuth: true, requiresOnboarding: false },
  { path: '/support/contact', requiresAuth: true, requiresOnboarding: false },

  // Onboarding Required Routes
  { path: '/create', requiresAuth: true, requiresOnboarding: true, rateLimited: true, contentValidation: true },
  { path: '/drafts', requiresAuth: true, requiresOnboarding: true },
  { path: '/edit', requiresAuth: true, requiresOnboarding: true, contentValidation: true },
  { path: '/my-inks', requiresAuth: true, requiresOnboarding: true },
  { path: '/my-drafts', requiresAuth: true, requiresOnboarding: true },
  { path: '/my-collections', requiresAuth: true, requiresOnboarding: true },
  { path: '/my-bookmarks', requiresAuth: true, requiresOnboarding: true },
  { path: '/my-likes', requiresAuth: true, requiresOnboarding: true },
  { path: '/my-following', requiresAuth: true, requiresOnboarding: true },
  { path: '/my-followers', requiresAuth: true, requiresOnboarding: true },
  { path: '/profile', requiresAuth: true, requiresOnboarding: true },
  { path: '/profile/edit', requiresAuth: true, requiresOnboarding: true, contentValidation: true },
  { path: '/messages', requiresAuth: true, requiresOnboarding: true },
  { path: '/conversations', requiresAuth: true, requiresOnboarding: true },
  { path: '/chat', requiresAuth: true, requiresOnboarding: true },
  { path: '/analytics', requiresAuth: true, requiresOnboarding: true },
  { path: '/analytics/overview', requiresAuth: true, requiresOnboarding: true },
  { path: '/analytics/performance', requiresAuth: true, requiresOnboarding: true },
  { path: '/analytics/audience', requiresAuth: true, requiresOnboarding: true },
  { path: '/analytics/content', requiresAuth: true, requiresOnboarding: true },
  { path: '/analytics/engagement', requiresAuth: true, requiresOnboarding: true },
  { path: '/insights', requiresAuth: true, requiresOnboarding: true },
  { path: '/workspace', requiresAuth: true, requiresOnboarding: true },
  { path: '/workspace/dashboard', requiresAuth: true, requiresOnboarding: true },
  { path: '/workspace/calendar', requiresAuth: true, requiresOnboarding: true },
  { path: '/workspace/schedule', requiresAuth: true, requiresOnboarding: true },
  { path: '/workspace/tools', requiresAuth: true, requiresOnboarding: true },
  { path: '/social', requiresAuth: true, requiresOnboarding: true },
  { path: '/social/connections', requiresAuth: true, requiresOnboarding: true },
  { path: '/social/invites', requiresAuth: true, requiresOnboarding: true },
  { path: '/social/recommendations', requiresAuth: true, requiresOnboarding: true },
  { path: '/monetization', requiresAuth: true, requiresOnboarding: true },
  { path: '/monetization/earnings', requiresAuth: true, requiresOnboarding: true },
  { path: '/monetization/payouts', requiresAuth: true, requiresOnboarding: true },
  { path: '/monetization/subscriptions', requiresAuth: true, requiresOnboarding: true },
  { path: '/monetization/sponsorships', requiresAuth: true, requiresOnboarding: true },
  { path: '/verification', requiresAuth: true, requiresOnboarding: true },
  { path: '/verification/email', requiresAuth: true, requiresOnboarding: true },
  { path: '/verification/phone', requiresAuth: true, requiresOnboarding: true },
  { path: '/verification/identity', requiresAuth: true, requiresOnboarding: true },
  { path: '/studio', requiresAuth: true, requiresOnboarding: true },
  { path: '/notifications', requiresAuth: true, requiresOnboarding: true },
  { path: '/settings', requiresAuth: true, requiresOnboarding: true },

  // Admin Routes
  { path: '/admin', requiresAuth: true, requiresOnboarding: true, requiresRole: 'admin' },
  { path: '/admin/dashboard', requiresAuth: true, requiresOnboarding: true, requiresRole: 'admin' },
  { path: '/admin/users', requiresAuth: true, requiresOnboarding: true, requiresRole: 'admin' },
  { path: '/admin/content', requiresAuth: true, requiresOnboarding: true, requiresRole: 'admin' },
  { path: '/admin/reports', requiresAuth: true, requiresOnboarding: true, requiresRole: 'admin' },
  { path: '/admin/settings', requiresAuth: true, requiresOnboarding: true, requiresRole: 'admin' },
]

// Helper functions
export const getRouteProtection = (pathname: string): RouteProtection | null => {
  // Exact match first
  const exactMatch = ROUTE_PROTECTION.find(route => route.path === pathname)
  if (exactMatch) return exactMatch

  // Pattern match for dynamic routes
  const patternMatch = ROUTE_PROTECTION.find(route => {
    if (route.path.includes('[') && route.path.includes(']')) {
      // Convert route pattern to regex
      const pattern = route.path
        .replace(/\[.*?\]/g, '[^/]+') // Replace [id] with [^/]+
        .replace(/\//g, '\\/') // Escape slashes
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(pathname)
    }
    return false
  })

  return patternMatch || null
}

export const isPublicRoute = (pathname: string): boolean => {
  const protection = getRouteProtection(pathname)
  return !protection || (!protection.requiresAuth && !protection.requiresOnboarding)
}

export const isAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith('/auth/')
}

export const requiresAuthentication = (pathname: string): boolean => {
  const protection = getRouteProtection(pathname)
  return protection?.requiresAuth || false
}

export const requiresOnboarding = (pathname: string): boolean => {
  const protection = getRouteProtection(pathname)
  return protection?.requiresOnboarding || false
}

export const requiresRole = (pathname: string): string | null => {
  const protection = getRouteProtection(pathname)
  return protection?.requiresRole || null
}

export const isRateLimited = (pathname: string): boolean => {
  const protection = getRouteProtection(pathname)
  return protection?.rateLimited || false
}

export const isCsrfProtected = (pathname: string): boolean => {
  const protection = getRouteProtection(pathname)
  return protection?.csrfProtected || false
}

export const needsContentValidation = (pathname: string): boolean => {
  const protection = getRouteProtection(pathname)
  return protection?.contentValidation || false
}

// Route categories for easy filtering
export const getPublicRoutes = (): string[] => {
  return ROUTE_PROTECTION
    .filter(route => !route.requiresAuth && !route.requiresOnboarding)
    .map(route => route.path)
}

export const getProtectedRoutes = (): string[] => {
  return ROUTE_PROTECTION
    .filter(route => route.requiresAuth)
    .map(route => route.path)
}

export const getOnboardingRequiredRoutes = (): string[] => {
  return ROUTE_PROTECTION
    .filter(route => route.requiresOnboarding)
    .map(route => route.path)
}

export const getAdminRoutes = (): string[] => {
  return ROUTE_PROTECTION
    .filter(route => route.requiresRole === 'admin')
    .map(route => route.path)
}

export const getRateLimitedRoutes = (): string[] => {
  return ROUTE_PROTECTION
    .filter(route => route.rateLimited)
    .map(route => route.path)
}

export const getCsrfProtectedRoutes = (): string[] => {
  return ROUTE_PROTECTION
    .filter(route => route.csrfProtected)
    .map(route => route.path)
}

// Validation helpers
export const validateRouteAccess = (
  pathname: string,
  isAuthenticated: boolean,
  isOnboarded: boolean,
  userRole?: string
): { allowed: boolean; redirectTo?: string; reason?: string } => {
  const protection = getRouteProtection(pathname)

  if (!protection) {
    return { allowed: true } // No protection rules, allow access
  }

  // Check authentication
  if (protection.requiresAuth && !isAuthenticated) {
    return { 
      allowed: false, 
      redirectTo: '/auth/signin',
      reason: 'Authentication required'
    }
  }

  // Check onboarding
  if (protection.requiresOnboarding && !isOnboarded) {
    return { 
      allowed: false, 
      redirectTo: '/onboarding',
      reason: 'Onboarding required'
    }
  }

  // Check role requirements
  if (protection.requiresRole && userRole !== protection.requiresRole) {
    return { 
      allowed: false, 
      redirectTo: '/',
      reason: 'Insufficient permissions'
    }
  }

  return { allowed: true }
}

// Export constants for middleware
export const PUBLIC_ROUTES = getPublicRoutes()
export const PROTECTED_ROUTES = getProtectedRoutes()
export const ONBOARDING_REQUIRED_ROUTES = getOnboardingRequiredRoutes()
export const ADMIN_ROUTES = getAdminRoutes()
export const RATE_LIMITED_ROUTES = getRateLimitedRoutes()
export const CSRF_PROTECTED_ROUTES = getCsrfProtectedRoutes() 