import styled from 'styled-components';

const StyledLoadingSpinner = styled.div`
  display: flex;
  color: ${(props) => (props.$color == 'dark' ? '#000' : '#fff')};
`;

function LoadingSpinner({ color }) {
  return (
    <StyledLoadingSpinner
      $color={color}
      role="status"
      className="spinner-border spinner-border-sm"
    >
      <span className="visually-hidden">Loading...</span>
    </StyledLoadingSpinner>
  );
}

export default LoadingSpinner;
