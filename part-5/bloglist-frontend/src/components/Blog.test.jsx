import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import { expect, test, vi } from "vitest";

test("renders blog title and author but not url or likes by default", async () => {
  const user = userEvent.setup();
  const blog = {
    title: "Test Blog",
    author: "Trust Author",
    url: "http://test.com",
    likes: 5,
  };

  render(
    <MemoryRouter>
      <Blog blog={blog} user={null} />
    </MemoryRouter>
  );

  // The title and author should be visible
  expect(screen.getByText("Test Blog")).toBeInTheDocument();
  expect(screen.getByText("Trust Author")).toBeInTheDocument();

  // The URL and likes should not be visible initially
  expect(screen.queryByText("http://test.com")).not.toBeInTheDocument();
  expect(screen.queryByText("likes 5")).not.toBeInTheDocument();

  // Click the "view" button to show the blog details
  const button = screen.getByRole("button", { name: "view" });
  await user.click(button);

  // After clicking, the URL and likes should be visible
  expect(screen.getByText("http://test.com")).toBeInTheDocument();
  expect(screen.getByText("likes 5")).toBeInTheDocument();
});

test("like button calls event handler twice when clicked twice", async () => {
  const userSetup = userEvent.setup();
  const handleLike = vi.fn();
  const blog = {
    title: "Test Blog",
    author: "Trust Author",
    url: "http://test.com",
    likes: 5,
  };
  const mockUser = {
    username: "testuser",
    name: "Test User",
  };

  render(
    <MemoryRouter>
      <Blog
        blog={blog}
        user={mockUser}
        handleLike={handleLike}
        removeBlogFromState={() => {}}
      />
    </MemoryRouter>
  );

  const button = screen.getByRole("button", { name: "view" });
  await userSetup.click(button);

  const likeButton = screen.getByRole("button", { name: "like" });
  await userSetup.click(likeButton);
  await userSetup.click(likeButton);

  expect(handleLike).toHaveBeenCalledTimes(2);
});

test("form submit the correct blog", async () => {
  const user = userEvent.setup();
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title");
  const authorInput = screen.getByLabelText("author");
  const urlInput = screen.getByLabelText("url");

  await user.type(titleInput, "Trust Blog Title");
  await user.type(authorInput, "trust Author");
  await user.type(urlInput, "http://test.com");

  const createButton = screen.getByRole("button", { name: "create" });
  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);

  expect(createBlog).toHaveBeenCalledWith({
    title: "Trust Blog Title",
    author: "trust Author",
    url: "http://test.com",
  });
});
