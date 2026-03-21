import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Request from '../components/Request';
import styled from 'styled-components';
import { getSubmissions, subscribeToMessages } from '../services/apiSubmission';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

  // Live-subscription for submissions
  useEffect(() => {
    const channel = subscribeToMessages((payload) => {
      queryClient.setQueryData(['submissions'], (old = []) => {
        return [...old, payload.new];
      });
    });

    // Cleanup on unmount
    return () => supabase.removeChannel(channel);
  }, [queryClient]);

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
            id={e._id}
          />
        ))}
      </Container>
    </StyledAdmin>
  );
}
