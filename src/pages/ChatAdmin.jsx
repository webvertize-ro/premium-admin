import styled from "styled-components";
import Chat from "../components/chat-admin/Chat";

const StyledChatAdmin = styled.div`
  height: calc(100vh - 64px - 41px);
  display: flex;
  flex-direction: column;
`;

function ChatAdmin() {
  return (
    <StyledChatAdmin>
      <Chat />
    </StyledChatAdmin>
  );
}

export default ChatAdmin;
