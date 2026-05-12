import { useEffect, useState } from "react";
import { useBlogPosts, useDeleteBlogPost } from "../hooks/useBlogPosts";
import BlogPostForm from "../components/BlogPostForm";
import toast from "react-hot-toast";
import ModalNew from "../components/ModalNew";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphonesSimple, faPlus } from "@fortawesome/free-solid-svg-icons";
import DeleteConfirm from "../components/DeleteConfirm";

const StyledAdminBlog = styled.div`
  padding-top: 2rem;
  color: #fff;
`;

const AddNewArticle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border: none;
  background-color: #468432;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: bold;
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 3rem 0;
`;

const Post = styled.div`
  border: 2px solid #fff;
  padding: 1rem;
  border-radius: 1rem;
`;

const TitleH3 = styled.h3``;

const Status = styled.div``;

const ShortDescription = styled.div``;

const Author = styled.div``;

const PublishDate = styled.div``;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;
`;

const EditButton = styled.button`
  border: none;
  background-color: #1e5128;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const DeleteButton = styled.button`
  border: none;
  background-color: #750e21;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

function AdminBlog() {
  const { data: posts, isLoading } = useBlogPosts();
  const { mutate: deletePost } = useDeleteBlogPost();

  const [mode, setMode] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const open = mode !== null;

  function handleCreate() {
    setMode("create");
    setSelectedPost(null);
  }

  function handleEdit(post) {
    setMode("edit");
    setSelectedPost(post);
  }

  function handleDelete(post) {
    setMode("delete");
    setSelectedPost(post);
  }

  function handleClose() {
    setMode(null);
    setSelectedPost(null);
  }

  if (isLoading) return <p>Se incarca...</p>;

  return (
    <StyledAdminBlog className="container">
      <div>
        <h2>Administrare Blog</h2>
        <AddNewArticle onClick={() => handleCreate()}>
          <div>
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div>Articol nou</div>
        </AddNewArticle>
      </div>
      <Posts>
        {posts?.map((post) => (
          <Post key={post.id}>
            <div>
              <TitleH3>
                <strong>Titlu: </strong>
                {post.title}
              </TitleH3>
              <Status>
                <strong>Status: </strong>
                {post.is_published ? "Publicat" : "Draft"}
              </Status>
              <ShortDescription>
                <strong>Scurtă descriere: </strong>
                {post.short_description}
              </ShortDescription>
              <Author>
                <strong>Autor: </strong>
                {post.author}
              </Author>
              <PublishDate>
                <strong>Data publicării: </strong>
                {new Date(post.created_at).toLocaleDateString("ro-RO")}
              </PublishDate>
            </div>
            <ActionButtonsContainer>
              <EditButton onClick={() => handleEdit(post)}>Editeaza</EditButton>
              <DeleteButton onClick={() => handleDelete(post)}>
                Sterge
              </DeleteButton>
            </ActionButtonsContainer>
          </Post>
        ))}
      </Posts>
      <ModalNew
        isOpen={open}
        onClose={handleClose}
        title={
          mode === "create"
            ? "Creare postare bllog"
            : mode === "edit"
              ? "Editare postare blog"
              : "Ștergere postare blog"
        }
      >
        {(mode === "create" || mode === "edit") && (
          <BlogPostForm
            key={selectedPost?.id ?? "new"}
            post={selectedPost}
            onClose={handleClose}
          />
        )}

        {mode === "delete" && (
          <DeleteConfirm post={selectedPost} onClose={handleClose} />
        )}
      </ModalNew>
    </StyledAdminBlog>
  );
}

export default AdminBlog;
