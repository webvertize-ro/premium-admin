import toast from "react-hot-toast";
import { useDeleteBlogPost } from "../hooks/useBlogPosts";
import styled from "styled-components";

const StyledP = styled.p`
  font-size: 1.2rem;
  margin: 0;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;
`;

const DeleteButton = styled.button`
  border: none;
  background-color: #750e21;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const EditButton = styled.button`
  border: none;
  background-color: #3b7597;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

function DeleteConfirm({ post, onClose }) {
  const { mutate: deletePost } = useDeleteBlogPost();

  function handleConfirm() {
    deletePost(post.id, {
      onSuccess: () => {
        toast.success("Articolul a fost șters.");
        onClose();
      },
      onError: () => toast.error("Eroare la ștergere."),
    });
  }

  return (
    <div>
      <div>
        <StyledP>
          Ești sigur că vrei să ștergi articolul <strong>"{post.title}"</strong>
          ?
        </StyledP>
      </div>
      <div>
        <StyledP>Această acțiune este ireversibilă!</StyledP>
      </div>
      <ActionButtonsContainer>
        <DeleteButton onClick={handleConfirm}>Șterge</DeleteButton>
        <EditButton onClick={onClose}>Anulează</EditButton>
      </ActionButtonsContainer>
    </div>
  );
}

export default DeleteConfirm;
