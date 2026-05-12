import React, { useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// --- Animations ---

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

// --- Styled Components ---

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 200ms ease;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 250ms cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #111;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #888;
  line-height: 1;
  padding: 4px;
  border-radius: 4px;
  transition:
    color 150ms,
    background 150ms;

  &:hover {
    color: #111;
    background: #f0f0f0;
  }
`;

const Body = styled.div`
  font-size: 0.95rem;
  color: #444;
  line-height: 1.6;
  overflow-y: auto;
  flex: 1;
`;

// --- Component ---

export default function ModalNew({ isOpen, onClose, title, children }) {
  const boxRef = useRef(null);

  // Close on outside click — handled inside the component itself
  useEffect(() => {
    if (!isOpen) return;

    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox ref={boxRef}>
        <ModalHeader>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>
        <Body>{children}</Body>
      </ModalBox>
    </Overlay>
  );
}
