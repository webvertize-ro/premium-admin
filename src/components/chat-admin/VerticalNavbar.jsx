import { faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import LoadingSpinner from "./LoadingSpinner";

const StyledVerticalNavbar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ $loading }) => ($loading ? "center" : "flex-start")};
  align-items: ${({ $loading }) => ($loading ? "center" : "stretch")};
  background: rgba(11, 34, 64, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid rgba(168, 212, 245, 0.1);
  height: 100%;
  overflow-y: auto;
  min-height: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    z-index: 150;
    padding-top: 5rem;
    background: rgba(11, 34, 64, 0.97);
    border-right: 1px solid rgba(168, 212, 245, 0.12);
    transform: ${({ $open }) =>
      $open ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.25s ease;
  }
`;

const NavOverlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 149;
  }
`;

const MobileNavButton = styled.button`
  display: none;
  position: fixed;
  bottom: 7.5rem;
  right: 1.25rem;
  z-index: 200;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(168, 212, 245, 0.3);
  background: rgba(11, 34, 64, 0.9);
  backdrop-filter: blur(8px);
  color: #a8d4f5;
  font-size: 1.2rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavHeader = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid rgba(168, 212, 245, 0.08);
  flex-shrink: 0;
`;

const NavHeading = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.35);
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid rgba(168, 212, 245, 0.06);
  cursor: pointer;
  transition: background 0.15s ease;
  background: ${({ $isSelected }) =>
    $isSelected ? "rgba(168, 212, 245, 0.1)" : "transparent"};

  &:hover {
    background: rgba(168, 212, 245, 0.07);
  }
`;

const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(168, 212, 245, 0.1);
  border: 1px solid rgba(168, 212, 245, 0.2);
  border-radius: 50%;
  height: 34px;
  width: 34px;
  flex-shrink: 0;
  color: rgba(168, 212, 245, 0.7);
  font-size: 0.8rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
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

function VerticalNavbar({
  users,
  onSelectedUser,
  isLoadingUsers,
  selectedUser,
  navOpen,
  setNavOpen,
}) {
  return (
    <>
      <NavOverlay $open={navOpen} onClick={() => setNavOpen(false)} />

      <StyledVerticalNavbar $loading={isLoadingUsers} $open={navOpen}>
        <NavHeader>
          <NavHeading>Conversații</NavHeading>
        </NavHeader>

        {isLoadingUsers && <LoadingSpinner />}

        {users?.map((user) => (
          <User
            key={user.id}
            $isSelected={user.id === selectedUser}
            onClick={() => {
              onSelectedUser(user.id);
              setNavOpen(false);
            }}
          >
            <Avatar>
              <FontAwesomeIcon icon={faUser} />
            </Avatar>
            <UserInfo>
              <UserName>{user.name}</UserName>
              <PhoneNumber>
                <FontAwesomeIcon icon={faPhone} />
                {user.phone_number}
              </PhoneNumber>
            </UserInfo>
          </User>
        ))}
      </StyledVerticalNavbar>

      <MobileNavButton onClick={() => setNavOpen((prev) => !prev)}>
        {navOpen ? "✕" : "☰"}
      </MobileNavButton>
    </>
  );
}

export default VerticalNavbar;
