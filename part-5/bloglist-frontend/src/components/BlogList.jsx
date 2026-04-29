import Blog from "./Blog";
import BlogForm from "./BlogForm";

const BlogList = ({ blogs, user, showCreateForm, setShowCreateForm, createBlog, updateBlogInState, removeBlogFromState }) => {
  return (
    <div>
      {user && (
        <div style={{ marginBottom: "20px" }}>
          {!showCreateForm ? (
            <button onClick={() => setShowCreateForm(true)}>create new</button>
          ) : (
            <BlogForm
              createBlog={createBlog}
              onCancel={() => setShowCreateForm(false)}
            />
          )}
        </div>
      )}

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlogInState={updateBlogInState}
          removeBlogFromState={removeBlogFromState}
        />
      ))}
    </div>
  );
};

export default BlogList;
