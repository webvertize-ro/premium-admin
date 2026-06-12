import { faPhone, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const StyledUserInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(11, 34, 64, 0.8);
  border-bottom: 1px solid rgba(168, 212, 245, 0.1);
  flex-shrink: 0;
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(168, 212, 245, 0.1);
  border: 1px solid rgba(168, 212, 245, 0.2);
  border-radius: 50%;
  height: 38px;
  width: 38px;
  flex-shrink: 0;
  color: rgba(168, 212, 245, 0.7);
  font-size: 0.9rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`;

const Username = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PhoneNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  color: rgba(168, 212, 245, 0.45);
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid rgba(168, 212, 245, 0.2);
  border-radius: 6px;
  color: rgba(168, 212, 245, 0.6);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(168, 212, 245, 0.1);
    color: #fff;
  }
`;

function UserInfo({ user, onSelectedUser }) {
  return (
    <StyledUserInfo>
      <UserIcon>
        <FontAwesomeIcon icon={faUser} />
      </UserIcon>
      <UserDetails>
        <Username>{user?.name}</Username>
        <PhoneNumber>
          <FontAwesomeIcon icon={faPhone} />
          {user?.phone_number}
        </PhoneNumber>
      </UserDetails>
      <CloseButton onClick={() => onSelectedUser(null)}>
        <FontAwesomeIcon icon={faXmark} />
      </CloseButton>
    </StyledUserInfo>
  );
}

export default UserInfo;
