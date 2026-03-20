import styled from 'styled-components';

const StyledLoadingSpinner = styled.div`
  display: flex;
`;

function LoadingSpinner() {
  return (
    <StyledLoadingSpinner className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </StyledLoadingSpinner>
  );
}

export default LoadingSpinner;
