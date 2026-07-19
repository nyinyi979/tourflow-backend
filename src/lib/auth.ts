export const ADMIN_TOKEN_KEY = "token";
export const ADMIN_UNAUTHORIZED_EVENT = "admin:unauthorized";

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminToken = (token: string) =>
  localStorage.setItem(ADMIN_TOKEN_KEY, token);

export const clearAdminSession = () =>
  localStorage.removeItem(ADMIN_TOKEN_KEY);

export const notifyAdminUnauthorized = () => {
  clearAdminSession();
  window.dispatchEvent(new Event(ADMIN_UNAUTHORIZED_EVENT));
};
