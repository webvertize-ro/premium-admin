import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import getMessages, { subscribeToMessages } from "../../services/apiMessages";
import { getUser } from "../../services/apiUsers";
import { useEffect, useRef } from "react";
import supabase from "../../services/supabase";
import MessageSender from "./MessageSender";
import Messages from "./Messages";
import UserInfo from "./UserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const StyledChatWindow = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(7, 22, 47, 0.5);
  height: 100%;
  min-height: 0;
`;

const IntroMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  font-size: 0.88rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: rgba(168, 212, 245, 0.3);
  text-align: center;
  padding: 2rem;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 2.5rem;
  color: rgba(168, 212, 245, 0.2);
`;

const ConversationWindow = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

function ChatWindow({ selectedUser, mutateMsg, onSelectedUser, isSending }) {
  const inputRef = useRef();

  function scrollToBottom() {
    if (inputRef.current) {
      inputRef.current.scrollTo({
        top: inputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  const queryClient = useQueryClient();
  // Retrieving the messages as per the "selectedUser" (user id) [Initial fetch with React Query]
  const { data: messages = [], isPending } = useQuery({
    queryKey: ["messages", selectedUser],
    queryFn: () => getMessages(selectedUser),
    enabled: !!selectedUser,
  });

  // live-subscription for the messages
  useEffect(() => {
    const channel = subscribeToMessages((payload) => {
      queryClient.setQueryData(["messages", selectedUser], (old = []) => {
        return [...old, payload.new];
      });
    });

    // Cleanup on unmount
    return () => supabase.removeChannel(channel);
  }, [queryClient, selectedUser]);

  const { data: user, isPending: isLoading } = useQuery({
    queryKey: ["user", selectedUser],
    queryFn: () => getUser(selectedUser),
    select: (data) => data[0],
  });

  // Scrolling to bottom on mount
  useEffect(() => {
    setTimeout(() => scrollToBottom(), 500);
  }, [selectedUser]);

  return (
    <StyledChatWindow>
      {!selectedUser && (
        <IntroMessage>
          <StyledFontAwesomeIcon icon={faComments} />
          Alegeți o conversație din partea stângă pentru a începe!
        </IntroMessage>
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
