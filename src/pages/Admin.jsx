import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Request from '../components/Request';
import styled from 'styled-components';
import {
  deleteSubmission,
  getSubmissions,
  subscribeToMessages,
} from '../services/apiSubmission';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../services/supabase';

const StyledAdmin = styled.div`
  background-color: rgba(54, 85, 104, 1);
  color: #fff;
`;

const Container = styled.div`
  padding: 1.25rem 0;
  display: flex;
  flex-direction: column;
`;

const StyledH2 = styled.h2`
  margin-bottom: 1.5rem;
`;

export default function Admin() {
  const queryClient = useQueryClient();

  // Retrieve the submissions initially with React Query
  const { data: submissions = [], isPending } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => getSubmissions(),
  });

  // Delete function
  const { mutate: mutateSub, isPending: isDeleting } = useMutation({
    mutationFn: deleteSubmission,
    onError: (error) => console.error(error),
  });

  // Live-subscription for submissions
  useEffect(() => {
    const channel = subscribeToMessages((payload) => {
      if (payload.eventType === 'INSERT') {
        queryClient.setQueryData(['submissions'], (old = []) => {
          console.log('old in subscribeToMessages is: ', old);
          return [...old, payload.new];
        });
      }

      if (payload.eventType === 'DELETE') {
        queryClient.setQueryData(['submissions'], (old) =>
          old.filter((s) => s.id !== payload.old.id),
        );
      }
    });

    // Cleanup on unmount
    return () => supabase.removeChannel(channel);
  }, [queryClient, mutateSub]);

  return (
    <StyledAdmin>
      <Container className="container">
        <StyledH2>Solicitări primite</StyledH2>
        {submissions.map((e) => (
          <Request
            name={e.name}
            email={e.email}
            message={e.message}
            date={e.created_at}
            id={e.id}
            mutateSub={mutateSub}
          />
        ))}
      </Container>
    </StyledAdmin>
  );
}
