import { Navigate, replace, useNavigate } from 'react-router-dom';
import { useSession } from '../services/useSession';
import LoadingSpinner from './chat-admin/LoadingSpinner';
import styled from 'styled-components';

const FullPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

function ProtectedRoute({ children }) {
  const { user, isPending } = useSession();

  if (isPending)
    return (
      <FullPage>
        <LoadingSpinner />
      </FullPage>
    );

  if (!user) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
