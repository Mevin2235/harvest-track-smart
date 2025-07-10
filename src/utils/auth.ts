
export const isAuthenticated = (): boolean => {
  const userType = localStorage.getItem("userType");
  const currentUser = localStorage.getItem("currentUser");
  return !!(userType && currentUser);
};

export const getUserType = (): string | null => {
  return localStorage.getItem("userType");
};

export const getCurrentUser = (): any => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const logout = (): void => {
  localStorage.removeItem("userType");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("username");
};

export const requireAuth = (userType: "farmer" | "admin"): boolean => {
  const currentUserType = getUserType();
  return isAuthenticated() && currentUserType === userType;
};
