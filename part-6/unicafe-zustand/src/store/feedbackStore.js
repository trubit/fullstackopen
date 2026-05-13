import { create } from "zustand";

const useStatisticLine = create((set, get) => ({
  good: 0,
  bad: 0,
  neutral: 0,

  action: {
    incrementGood: () => set((state) => ({ good: state.good + 1 })),
    incrementBad: () => set((state) => ({ bad: state.bad + 1 })),
    incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),

    resetAll: () => set({ good: 0, bad: 0, neutral: 0 }),
  },

  getTotal: () => {
    const { good, bad, neutral } = get();
    return good + bad + neutral;
  },
  getAverage: () => {
    const total = get().getTotal();
    if (total === 0) return 0;
    return (get().good - get().bad) / total;
  },

  getPositivePercentage: () => {
    const total = get().getTotal();
    if (total === 0) return 0;
    return (get().good / total) * 100;
  },
}));

export default useStatisticLine;

// import
