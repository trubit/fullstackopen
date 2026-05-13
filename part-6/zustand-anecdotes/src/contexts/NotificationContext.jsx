import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return { notification: context.notification };
};

export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotify must be used within a NotificationProvider");
  }
  return context.notify;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const notify = useCallback((message) => {
    setNotification({ message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);

  const value = {
    notification,
    notify,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
