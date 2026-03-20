import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from './apiAuth';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      navigate('/chat', { replace: true });
    },
    onError: (err) => {
      console.log('ERROR', err);
      console.error('Provided email or password are incorrect');
    },
  });

  return { login, isLoading };
}
