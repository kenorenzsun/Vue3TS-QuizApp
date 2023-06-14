const client = typeof window !== "undefined";

export const getUserToken = (): string => {
  if (client) {
    const encrypted_token = localStorage.getItem("token");

    return encrypted_token ? window.atob(encrypted_token) : "";
  }
  return "";
};

export const setUserToken = async (value: string): Promise<void> => {
  if (client) {
    localStorage.setItem("token", window.btoa(value));
  }
  return Promise.resolve();
};
