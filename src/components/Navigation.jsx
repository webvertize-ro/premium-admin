import React, { useState } from "react";
import Logo from "./Logo";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const NavContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 101;
  width: 100%;
`;

const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 101;
  width: 100%;
  background: rgba(11, 34, 64, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(168, 212, 245, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
`;

const NavInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 1.5rem;
  gap: 1rem;

  @media (max-width: 992px) {
    flex-wrap: wrap;
    height: auto;
    padding: 0.75rem 1rem;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  height: 64px;
  gap: 0.25rem;

  @media (max-width: 992px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: auto;
    padding: 0.5rem 0 0.75rem;
    gap: 0;
    order: 3;
  }
`;

const StyledLi = styled.li`
  display: flex;
  align-items: center;
  height: 64px;

  @media (max-width: 992px) {
    height: auto;
    width: 100%;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.8);
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  text-decoration: none;
  border-bottom: 3px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    color: #a8d4f5;
    border-bottom-color: rgba(168, 212, 245, 0.4);
  }

  &.active {
    color: #fff;
    border-bottom-color: #a8d4f5;
  }

  @media (max-width: 992px) {
    height: auto;
    width: 100%;
    padding: 0.6rem 0.75rem;
    border-bottom: none;
    border-left: 3px solid transparent;

    &:hover {
      border-bottom: none;
      border-left-color: rgba(168, 212, 245, 0.4);
    }

    &.active {
      border-bottom: none;
      border-left-color: #a8d4f5;
    }
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: 1px solid rgba(168, 212, 245, 0.3);
  border-radius: 6px;
  color: #a8d4f5;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(168, 212, 245, 0.1);
  }

  @media (max-width: 992px) {
    display: flex;
    align-items: center;
  }
`;

const LogoutButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  text-transform: uppercase;
  background-color: #88304e;
  color: #fff;
`;

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <NavContainer>
      <StyledNav>
        <NavInner>
          <a href="#">
            <Logo />
          </a>
          <MobileToggle onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? "✕" : "☰"}
          </MobileToggle>
          <NavLinks $open={menuOpen}>
            <StyledLi>
              <StyledNavLink to="/requests">Solicitări</StyledNavLink>
            </StyledLi>
            <StyledLi>
              <StyledNavLink to="/chat">Chat Live</StyledNavLink>
            </StyledLi>
            <StyledLi>
              <StyledNavLink to="/blog">Blog</StyledNavLink>
            </StyledLi>
            <StyledLi>
              <StyledNavLink to="/admin">Conținut</StyledNavLink>
            </StyledLi>
          </NavLinks>
        </NavInner>
      </StyledNav>
    </NavContainer>
  );
}

export default Navigation;
