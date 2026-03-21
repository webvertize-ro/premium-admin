import styled from 'styled-components';
import { logUserIn } from '../services/apiAuth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../components/chat-admin/LoadingSpinner';

/**
 * 
 * logUserIn expects an object which looks like this: 
 * {
      email: 'admin@firma.ro',
      password: 'test1234',
    }
 * 
 * 
 */

const StyledLogin = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Login() {
  const { register, reset, handleSubmit } = useForm();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate: login, isPending } = useMutation({
    mutationFn: logUserIn,
    onSuccess: (data) => {
      queryClient.setQueryData(['session'], data.user);
      navigate('/chat');
    },
    onError: (error) => {
      toast.error(error.message || 'Invalid email or password');
    },
  });

  function handleLogin(data) {
    login(data);
  }

  return (
    <StyledLogin>
      <h3>Log in</h3>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            {...register('email')}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            {...register('password')}
          />
        </div>
        <StyledButton type="submit" className="btn btn-primary">
          {isPending && <LoadingSpinner size="sm" />}
          Log in
        </StyledButton>
      </form>
    </StyledLogin>
  );
}

export default Login;
