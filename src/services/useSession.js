import { useQuery } from '@tanstack/react-query';
import supabase from './supabase';

async function getAuthenticatedUser() {
  // Check the localStorage
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;

  // Check on the server
  const { data, error } = await supabase.auth.getUser();
  console.log('data in getAuthenticatedUser: ', data);

  return data.user;
}

export function useSession() {
  const { data: user, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: getAuthenticatedUser,
  });

  return { user, isPending };
}
