import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import getMessages, { subscribeToMessages } from '../../services/apiMessages';
import { getUser, subscribeToUsers } from '../../services/apiUsers';
import { useEffect, useRef, useState } from 'react';
import supabase from '../../services/supabase';
import { useForm } from 'react-hook-form';
import MessageSender from './MessageSender';
import Messages from './Messages';
import UserInfo from './UserInfo';

const StyledChatWindow = styled.div`
  background-color: #fff;
  display: ${(props) => (props.$selectedUser ? 'unset' : 'flex')};
  flex: 3;
  justify-content: ${(props) => (props.$selectedUser ? 'unset' : 'center')};
  align-items: ${(props) => (props.$selectedUser ? 'unset' : 'center')};
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

const ConversationWindow = styled.div``;

function ChatWindow({ selectedUser, mutateMsg, onSelectedUser, isSending }) {
  const inputRef = useRef();

  function scrollToBottom() {
    if (inputRef.current) {
      inputRef.current.scrollTo({
        top: inputRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  const queryClient = useQueryClient();
  // Retrieving the messages as per the "selectedUser" (user id) [Initial fetch with React Query]
  const { data: messages = [], isPending } = useQuery({
    queryKey: ['messages', selectedUser],
    queryFn: () => getMessages(selectedUser),
    enabled: !!selectedUser,
  });

  // live-subscription for the messages
  useEffect(() => {
    const channel = subscribeToMessages((payload) => {
      queryClient.setQueryData(['messages', selectedUser], (old = []) => {
        return [...old, payload.new];
      });
    });

    // Cleanup on unmount
    return () => supabase.removeChannel(channel);
  }, [queryClient, selectedUser]);

  const { data: user, isPending: isLoading } = useQuery({
    queryKey: ['user', selectedUser],
    queryFn: () => getUser(selectedUser),
    select: (data) => data[0],
  });

  // Scrolling to bottom on mount
  useEffect(() => {
    setTimeout(() => scrollToBottom(), 500);
  }, [selectedUser]);

  return (
    <StyledChatWindow $selectedUser={selectedUser}>
      {!selectedUser && (
        <div>Alegeți o conversație din partea stângă pentru a începe!</div>
      )}
      {selectedUser && (
        <ConversationWindow>
          <UserInfo user={user} onSelectedUser={onSelectedUser} />
          {/* Messages */}
          <Messages messages={messages} user={user} inputRef={inputRef} />
          {/* Message Sender */}
          <MessageSender
            selectedUser={selectedUser}
            mutateMsg={mutateMsg}
            isSending={isSending}
            scrollToBottom={scrollToBottom}
          />
        </ConversationWindow>
      )}
    </StyledChatWindow>
  );
}

export default ChatWindow;
