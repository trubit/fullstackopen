import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../store/notificationStore", () => ({
  setNotification: vi.fn(),
}));

import { useAnecdoteStore } from "../../store/store";

global.fetch = vi.fn();

describe("Anecdote Store", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: "" });
    vi.clearAllMocks();
  });

  // Note: verifies fetched anecdotes are stored and sorted by votes descending.
  it("should initialize anecdotes", async () => {
    const mockAnecdotes = [
      {
        id: "1",
        content: "If it hurts, do it more often",
        votes: 0,
      },
      {
        id: "2",
        content:
          "Debugging is twice as hard as writing the code in the first place.",
        votes: 5,
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnecdotes,
    });

    const { initializeAnecdotes } = useAnecdoteStore.getState().actions;

    await initializeAnecdotes();

    const state = useAnecdoteStore.getState();

    expect(state.anecdotes).toHaveLength(2);
    expect(state.anecdotes[0].content).toBe(
      "Debugging is twice as hard as writing the code in the first place.",
    );
    expect(state.anecdotes[0].votes).toBeGreaterThanOrEqual(
      state.anecdotes[1].votes,
    );
    expect(state.anecdotes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: mockAnecdotes[0].content }),
        expect.objectContaining({ content: mockAnecdotes[1].content }),
      ]),
    );
  });

  // Note: verifies calling vote updates the target anecdote with one additional vote.
  it("should increase votes by one when voting an anecdote", async () => {
    useAnecdoteStore.setState({
      anecdotes: [{ id: "1", content: "Test anecdote", votes: 2 }],
      filter: "",
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "1", content: "Test anecdote", votes: 3 }),
    });

    const { vote } = useAnecdoteStore.getState().actions;

    await vote("1");

    const state = useAnecdoteStore.getState();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/anecdotes/1",
      expect.objectContaining({ method: "PUT" }),
    );
    expect(state.anecdotes[0].id).toBe("1");
    expect(state.anecdotes[0].votes).toBe(3);
  });
});
