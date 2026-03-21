import styled from 'styled-components';
import Footer from './Footer';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';

const StyledAppLayout = styled.div`
  background-color: rgba(54, 85, 104, 1);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Navigation />
      <Outlet />
      <Footer />
    </StyledAppLayout>
  );
}

export default AppLayout;
