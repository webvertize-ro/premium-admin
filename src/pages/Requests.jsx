import { useEffect } from "react";
import Navigation from "../components/Navigation";
import Request from "../components/Request";
import styled from "styled-components";
import {
  deleteSubmission,
  getSubmissions,
  subscribeToMessages,
} from "../services/apiSubmission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../services/supabase";
import { PageHeading } from "../shared/shared";

const StyledAdmin = styled.div`
  color: #fff;
  min-height: calc(100vh - 64px - 41px);
`;

const Container = styled.div`
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(168, 212, 245, 0.35);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export default function Requests() {
  const queryClient = useQueryClient();

  // Retrieve the submissions initially with React Query
  const { data: submissions = [], isPending } = useQuery({
    queryKey: ["submissions"],
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
      if (payload.eventType === "INSERT") {
        queryClient.setQueryData(["submissions"], (old = []) => {
          return [...old, payload.new];
        });
      }

      if (payload.eventType === "DELETE") {
        queryClient.setQueryData(["submissions"], (old) =>
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
        <PageHeading>Solicitări primite</PageHeading>
        {submissions.length === 0 ? (
          <EmptyState>Nicio solicitare primită</EmptyState>
        ) : (
          submissions.map((e) => (
            <Request
              key={e.id}
              name={e.name}
              email={e.email}
              message={e.message}
              date={e.created_at}
              id={e.id}
              mutateSub={mutateSub}
            />
          ))
        )}
      </Container>
    </StyledAdmin>
  );
}
