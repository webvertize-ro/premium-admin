import { faPhone, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const StyledUserInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
  border-bottom: 2px solid #27374d;
  padding: 0.5rem;
  background-color: #2c74b3;
  color: #fff;
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
  height: 45px;
  width: 45px;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
`;

const StyledFontAwesomeIcon2 = styled(FontAwesomeIcon)`
  color: #fff;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.div``;

const PhoneNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
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
        <Username>
          <strong>{user?.name}</strong>
        </Username>
        <PhoneNumber>
          <FontAwesomeIcon icon={faPhone} />
          {user?.phone_number}
        </PhoneNumber>
      </UserDetails>
      <ClosingButton onClick={() => onSelectedUser(null)}>
        <StyledFontAwesomeIcon2 icon={faXmark} />
      </ClosingButton>
    </StyledUserInfo>
  );
}

export default UserInfo;
