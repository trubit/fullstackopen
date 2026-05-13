
import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notification: null,

  actions: {
    setNotification: (message) => {
      set({ notification: { message } });
      setTimeout(() => {
        set({ notification: null });
      }, 5000);
    },
    clearNotification: () => set({ notification: null }),
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.notification);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
export const setNotification = (message) =>
  useNotificationStore.getState().actions.setNotification(message);
  

    
