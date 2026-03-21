import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const StyledVerticalNavbar = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: ${(props) => (props.$loading ? 'center' : 'unset')};
  align-items: ${(props) => (props.$loading ? 'center' : 'unset')};
  gap: 0.25rem;
  background-color: #fff;
  border-right: 1px solid black;
  height: 100%;
`;

const User = styled.div`
  display: flex;
  gap: 0.25rem;
`;

function VerticalNavbar({ users, onSelectedUser, isLoadingUsers }) {
  return (
    <StyledVerticalNavbar $loading={isLoadingUsers}>
      {isLoadingUsers && <LoadingSpinner />}
      {users?.map((user) => (
        <User
          key={user.id}
          onClick={() => {
            onSelectedUser(user.id);
          }}
        >
          {/* Icon */}
          <div>
            <FontAwesomeIcon icon={faUser} />
          </div>
          {/* Name */}
          <div>{user.name}</div>
        </User>
      ))}
    </StyledVerticalNavbar>
  );
}

export default VerticalNavbar;
