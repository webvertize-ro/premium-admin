import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import getUsers, { subscribeToUsers } from '../../services/apiUsers';
import supabase from '../../services/supabase';
import VerticalNavbar from './VerticalNavbar';
import ChatWindow from './ChatWindow';
import styled from 'styled-components';
import { sendMessage } from '../../services/apiMessages';

const StyledChat = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-self: stretch;
  height: 100%;
  height: 600px;
`;

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);

  const queryClient = useQueryClient();

  // Initial fetch with React Query (for users)
  const { data: users, isPending: isLoadingUsers } = useQuery({
    queryKey: ['users', 100],
    queryFn: () => getUsers(),
  });

  // Subscription to keep cache up to date (for users)
  useEffect(() => {
    const channel = subscribeToUsers((payload) => {
      queryClient.setQueryData(['users', 100], (old = []) => {
        return [...old, payload.new];
      });
    });

    // Cleanup on unmount
    return () => supabase.removeChannel(channel);
  }, [queryClient, selectedUser]);

  // Sending the message
  const { mutate: mutateMsg, isPending: isSending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {},
    onError: (error) => console.error(error),
  });

  return (
    <StyledChat>
      {/* Left vertical navbar with all the users from the db (users) */}
      <VerticalNavbar
        users={users}
        onSelectedUser={setSelectedUser}
        isLoadingUsers={isLoadingUsers}
      />
      {/* Right side with a chat window (users & messages) */}
      <ChatWindow
        selectedUser={selectedUser}
        onSelectedUser={setSelectedUser}
        mutateMsg={mutateMsg}
        isSending={isSending}
      />
    </StyledChat>
  );
}

export default Chat;
