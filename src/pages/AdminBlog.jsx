import { useState } from "react";
import { useBlogPosts, useDeleteBlogPost } from "../hooks/useBlogPosts";
import BlogPostForm from "../components/BlogPostForm";
import Modal from "../components/Modal";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import DeleteConfirm from "../components/DeleteConfirm";
import LoadingSpinner from "../components/LoadingSpinner";

const StyledAdminBlog = styled.div`
  padding: 2rem;
  color: #fff;
  min-height: calc(100vh - 64px - 41px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SpinnerContainer = styled.div`
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(168, 212, 245, 0.1);
  gap: 1rem;
  flex-wrap: wrap;
`;

const PageHeading = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.5);
  margin: 0;
`;

const AddNewArticle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.3);
  background: rgba(168, 212, 245, 0.12);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: rgba(168, 212, 245, 0.2);
    border-color: rgba(168, 212, 245, 0.5);
  }
`;

const SortingButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
`;

const SortingButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: transparent;
  color: rgba(168, 212, 245, 0.6);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(168, 212, 245, 0.08);
    color: rgba(168, 212, 245, 0.9);
  }
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
`;

const Post = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  background: rgba(15, 47, 90, 0.5);
  border: 1px solid rgba(168, 212, 245, 0.1);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(168, 212, 245, 0.2);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PostMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
`;

const PostTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.25rem;
  overflow-wrap: break-word;
`;

const MetaRow = styled.div`
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
`;

const FieldLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: ${({ $published }) =>
    $published ? "rgba(74, 222, 128, 0.12)" : "rgba(168, 212, 245, 0.08)"};
  color: ${({ $published }) =>
    $published ? "rgba(74, 222, 128, 0.85) " : "rgba(168, 212, 245, 0.5)"};
  border: 1px solid
    ${({ $published }) =>
      $published ? "rgba(74, 222, 128, 0.25)" : "rgba(168, 212, 245, 0.15)"};
`;

const TitleH3 = styled.h3``;

const Status = styled.div``;

const ShortDescription = styled.div``;

const Author = styled.div``;

const PublishDate = styled.div``;

const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex-shrink: 0;

  @media (max-width: 600px) {
    flex-direction: row;
  }
`;

const EditButton = styled.button`
  padding: 0.35rem 0.9rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.25);
  background: transparent;
  color: rgba(168, 212, 245, 0.8);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(168, 212, 245, 0.1);
    color: #fff;
  }
`;

const DeleteButton = styled.button`
  padding: 0.35rem 0.9rem;
  border-radius: 6px;
  border: 1px solid rgba(248, 113, 113, 0.25);
  background: transparent;
  color: rgba(248, 113, 113, 0.7);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(248, 113, 113, 0.1);
    color: #fca5a5;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(168, 212, 245, 0.35);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

function AdminBlog() {
  const [ascending, setAscending] = useState(false);

  const { data: posts, isLoading } = useBlogPosts(ascending);

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

  if (isLoading)
    return (
      <StyledAdminBlog>
        <SpinnerContainer>
          <LoadingSpinner />
        </SpinnerContainer>
      </StyledAdminBlog>
    );

  return (
    <Modal>
      <StyledAdminBlog>
        <div className="container">
          <PageHeader>
            <PageHeading>Administrare Blog</PageHeading>
            <AddNewArticle onClick={handleCreate}>
              <FontAwesomeIcon icon={faPlus} />
              Articol nou
            </AddNewArticle>
          </PageHeader>
          <Posts>
            <SortingButtonContainer>
              <SortingButton onClick={() => setAscending((e) => !e)}>
                <FontAwesomeIcon icon={ascending ? faSortDown : faSortUp} />
                Sortează {ascending ? "descrescător" : "crescător"}
              </SortingButton>
            </SortingButtonContainer>

            {posts?.map((post) => (
              <Post key={post.id}>
                <PostMeta>
                  <PostTitle>{post.title}</PostTitle>
                  <MetaRow>
                    <FieldLabel>Status</FieldLabel>
                    <StatusBadge $published={post.is_published}>
                      {post.is_published ? "Publicat" : "Draft"}
                    </StatusBadge>
                  </MetaRow>
                  <MetaRow>
                    <FieldLabel>Descriere</FieldLabel>
                    {post.short_description}
                  </MetaRow>
                  <MetaRow>
                    <FieldLabel>Autor</FieldLabel>
                    {post.author}
                  </MetaRow>
                  <MetaRow>
                    <FieldLabel>Dată</FieldLabel>
                    {new Date(post.created_at).toLocaleDateString("ro-RO")}
                  </MetaRow>
                </PostMeta>
                <ActionButtonsContainer>
                  <EditButton onClick={() => handleEdit(post)}>
                    Editează
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(post)}>
                    Șterge
                  </DeleteButton>
                </ActionButtonsContainer>
              </Post>
            ))}

            {posts.length === 0 && (
              <EmptyState>Momentan nu există postări</EmptyState>
            )}
          </Posts>

          <Modal.Window
            isOpen={open}
            onClose={handleClose}
            title={
              mode === "create"
                ? "Creare postare blog"
                : mode === "edit"
                  ? "Editare postare blog"
                  : "Ștergere postare blog"
            }
            size={mode === "delete" ? "small" : "large"}
          >
            <>
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
            </>
          </Modal.Window>
        </div>
      </StyledAdminBlog>
    </Modal>
  );
}

export default AdminBlog;
