import styled from 'styled-components';

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const StyledButton = styled.button`
  flex: 1;
  border: none;
  background-color: ${(props) =>
    props.action === 'delete' ? '#88304E' : '#0F3460'};
  border-radius: 0.5rem;
  color: #fff;
`;

const StyledDeleteModalInner = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StyledH5 = styled.h5`
  text-align: center;
`;

const StyledP = styled.p`
  text-align: center;
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
        <StyledButton
          action="delete"
          onClick={() => {
            mutateSub(id);
            onCloseModal();
          }}
        >
          Șterge
        </StyledButton>
        <StyledButton action="cancel" onClick={() => onCloseModal?.()}>
          Anulează
        </StyledButton>
      </ActionButtons>
    </StyledDeleteModalInner>
  );
}

export default DeleteModalInner;
