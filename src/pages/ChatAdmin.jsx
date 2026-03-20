import { useQuery, useQueryClient } from '@tanstack/react-query';
import getUsers from '../services/apiUsers';
import { useEffect, useState } from 'react';
import { subscribeToUsers } from '../services/apiUsers';
import supabase from '../services/supabase';
import VerticalNavbar from '../components/chat-admin/VerticalNavbar';
import styled from 'styled-components';
import ChatWindow from '../components/chat-admin/ChatWindow';
import Chat from '../components/chat-admin/Chat';

const StyledChatAdmin = styled.div`
  border: 2px solid lime;
  height: 100%;
`;

function ChatAdmin() {
  return (
    <StyledChatAdmin className="container">
      <Chat />
    </StyledChatAdmin>
  );
}

export default ChatAdmin;
