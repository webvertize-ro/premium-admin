import { useLogout } from '../../services/useLogout';

function Logout() {
  const { logout, isLoading } = useLogout();

  return (
    <button disabled={isLoading} onClick={logout}>
      Logout
    </button>
  );
}

export default Logout;
