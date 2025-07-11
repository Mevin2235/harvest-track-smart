// Check if user is authenticated
export const isAuthenticated = () => {
  const userType = localStorage.getItem("userType");
  const currentUser = localStorage.getItem("currentUser");
  return !!(userType && currentUser);
};

// Get user type from localStorage
export const getUserType = () => {
  return localStorage.getItem("userType");
};

// Get full current user object from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

// Logout: clear localStorage
export const logout = () => {
  localStorage.removeItem("userType");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("username");
};

// Check if user is authenticated and of a required type
export const requireAuth = (userType) => {
  const currentUserType = getUserType();
  return isAuthenticated() && currentUserType === userType;
};

// Get unique user identifier
export const getUserId = () => {
  const currentUser = getCurrentUser();
  return currentUser?.id || currentUser?.username || null;
};
