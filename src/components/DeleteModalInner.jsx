import styled from "styled-components";

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(248, 113, 113, 0.3);
  background: transparent;
  color: rgba(248, 113, 113, 0.8);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(248, 113, 113, 0.12);
    color: #fca5a5;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: transparent;
  color: rgba(168, 212, 245, 0.6);
  font-size: 0.78rem;
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

const StyledButton = styled.button`
  flex: 1;
  border: none;
  background-color: ${(props) =>
    props.action === "delete" ? "#88304E" : "#0F3460"};
  border-radius: 0.5rem;
  color: #fff;
`;

const StyledDeleteModalInner = styled.div`
  padding: 1.25rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledH5 = styled.h5`
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.5;
`;

const StyledP = styled.p`
  text-align: center;
  font-size: 0.8rem;
  color: rgba(168, 212, 245, 0.45);
  margin: 0;
  line-height: 1.5;
`;

function DeleteModalInner({ onCloseModal, id, mutateSub }) {
  return (
    <StyledDeleteModalInner>
      <StyledH5>
        Sigur doriți să ștergeți această intrare în baza de date?
      </StyledH5>
      <StyledP>
        Această acțiune va șterge intrarea din baza de date și este
        ireversibilă.
      </StyledP>
      <ActionButtons>
        <DeleteButton
          onClick={() => {
            mutateSub(id);
            onCloseModal();
          }}
        >
          Șterge
        </DeleteButton>
        <CancelButton onClick={() => onCloseModal?.()}>Anulează</CancelButton>
      </ActionButtons>
    </StyledDeleteModalInner>
  );
}

export default DeleteModalInner;
