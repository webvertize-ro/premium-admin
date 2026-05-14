import { faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import LoadingSpinner from "./LoadingSpinner";

const StyledVerticalNavbar = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: ${(props) => (props.$loading ? "center" : "unset")};
  align-items: ${(props) => (props.$loading ? "center" : "unset")};

  background-color: #fff;
  border-right: 1px solid black;
  height: 100%;
  overflow-y: auto;
  max-height: 600px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 2px solid #eee;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${(props) => (props.isSelected ? "#ede9e6" : "#fff")};

  &:hover {
    background-color: #ede9e6;
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  background-color: #ede9e6;
  border-radius: 50%;
  height: 35px;
  width: 35px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PhoneNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

function VerticalNavbar({
  users,
  onSelectedUser,
  isLoadingUsers,
  selectedUser,
}) {
  return (
    <StyledVerticalNavbar $loading={isLoadingUsers}>
      {isLoadingUsers && <LoadingSpinner />}
      {users?.map((user) => (
        <User
          key={user.id}
          isSelected={user.id === selectedUser}
          onClick={() => {
            onSelectedUser(user.id);
          }}
        >
          {/* Icon */}
          <Icon>
            <FontAwesomeIcon icon={faUser} />
          </Icon>

          {/* User Info */}
          <UserInfo>
            {/* Name */}
            <div>{user.name}</div>
            {/* Phone Number */}
            <PhoneNumber>
              <FontAwesomeIcon icon={faPhone} />
              {user.phone_number}
            </PhoneNumber>
          </UserInfo>
        </User>
      ))}
    </StyledVerticalNavbar>
  );
}

export default VerticalNavbar;
