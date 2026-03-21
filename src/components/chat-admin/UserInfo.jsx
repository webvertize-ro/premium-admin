import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const StyledUserInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
  border-bottom: 1px solid black;
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClosingButton = styled.button`
  border: none;
  background-color: transparent;
`;

function UserInfo({ user, onSelectedUser }) {
  return (
    <StyledUserInfo>
      <UserIcon>
        <StyledFontAwesomeIcon icon={faUser} />
      </UserIcon>
      <UserDetails>
        <div>{user?.name}</div>
        <div>{user?.phone_number}</div>
      </UserDetails>
      <ClosingButton onClick={() => onSelectedUser(null)}>
        <FontAwesomeIcon icon={faXmark} />
      </ClosingButton>
    </StyledUserInfo>
  );
}

export default UserInfo;
