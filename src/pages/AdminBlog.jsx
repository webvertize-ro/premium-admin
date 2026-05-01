import { useState } from "react";
import { useBlogPosts, useDeleteBlogPost } from "../hooks/useBlogPosts";
import BlogPostForm from "../components/BlogPostForm";
import toast from "react-hot-toast";

function AdminBlog() {
  const { data: posts, isLoading } = useBlogPosts();
  const { mutate: deletePost } = useDeleteBlogPost();
  const [editingPost, setEditingPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) return <p>Se incarca...</p>;

  return (
    <div>
      <div>
        <h2>Administrare Blog</h2>
        <button onClick={() => setIsCreating(true)}>+ Articol nou</button>
      </div>

      {posts?.map((post) => (
        <div key={post.id}>
          <div>
            <h3>{post.title}</h3>
            <span>{post.is_published ? "Publicat" : "Draft"}</span>
            <p>{post.short_description}</p>
            <p>
              {post.author} -{" "}
              {new Date(post.created_at).toLocaleDateString("ro-RO")}
            </p>
          </div>
          <div>
            <button onClick={() => setEditingPost(post)}>Editeaza</button>
            <button
              onClick={() => {
                if (window.confirm("Stergi acest articol?")) {
                  deletePost(post.id, {
                    onSuccess: () => toast.success("Articol sters!"),
                    onError: () => toast.error("Eroare la stergere"),
                  });
                }
              }}
            >
              Sterge
            </button>
          </div>
        </div>
      ))}

      {(isCreating || editingPost) && (
        <BlogPostForm
          post={editingPost}
          onClose={() => {
            setIsCreating(false);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminBlog;
