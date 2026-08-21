import styled from "styled-components";
import { logUserIn } from "../services/apiAuth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../components/chat-admin/LoadingSpinner";
import Logo from '../components/Logo';

const StyledLogin = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(160deg, #0b2240 0%, #0f2f5a 50%, #1a3f72 100%);
  padding: 1.5rem;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 2rem 1.75rem;
  background: rgba(11, 34, 64, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(168, 212, 245, 0.15);
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

const StyledH3 = styled.h3`
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.6);
  margin-bottom: 1.75rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const FormLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.9rem;
  transition: border-color 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: rgba(168, 212, 245, 0.25);
  }

  &:focus {
    outline: none;
    border-color: rgba(168, 212, 245, 0.5);
    background: rgba(255, 255, 255, 0.09);
  }
`;

const LoginButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.4);
  background: rgba(168, 212, 245, 0.14);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled){
    background: rgba(168, 212, 245, 0.22);
    border-color: rgba(168, 212, 245, 0.6);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: login, isPending } = useMutation({
    mutationFn: logUserIn,
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data.user);
      navigate("/requests");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid email or password");
    },
  });

  function handleLogin(data) {
    login(data);
  }

  return (
    <StyledLogin>
      <LoginCard>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <StyledH3>Admin Login</StyledH3>

        <StyledForm onSubmit={handleSubmit(handleLogin)}>
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <StyledInput id="email" type="email" {...register('email')} />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Password</FormLabel>
            <StyledInput id="password" type="password" {...register('password')} />
          </FormGroup>

          <LoginButton type="submit" disabled={isPending}>
            {isPending ? <LoadingSpinner size="sm" /> : "Log in"}
          </LoginButton>
        </StyledForm>
      </LoginCard>
    </StyledLogin>
  );
}

export default Login;
