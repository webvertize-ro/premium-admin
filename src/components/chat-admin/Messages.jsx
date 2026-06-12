import { useState } from "react";
import styled from "styled-components";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";

/**
 * if image, check if there is also a message
 *    - if also a message, display both
 *    - if not, display just the image
 * if not, check if there is document_name
 *    - check if also a message
 *        - if also a message, display both (link and message)
 *    - if not, display only the link
 * if not, display only the message
 *
 *
 *
 */

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  background: rgba(7, 22, 47, 0.4);
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 70%;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  color: #fff;
  word-break: break-word;
  overflow-wrap: break-word;

  background: ${({ $senderType }) =>
    $senderType === "admin"
      ? "rgba(26, 79, 138, 0.75)"
      : "rgba(15, 47, 90, 0.9)"};
  align-self: ${({ $senderType }) =>
    $senderType === "admin" ? "flex-end" : "flex-start"};
  border: 1px solid
    ${({ $senderType }) =>
      $senderType === "admin"
        ? "rgba(168, 212, 245, 0.25)"
        : "rgba(168, 212, 245, 0.1)"};
  border-bottom-right-radius: ${({ $senderType }) =>
    $senderType === "admin" ? "2px" : "10px"};
  border-bottom-left-radius: ${({ $senderType }) =>
    $senderType === "admin" ? "10px" : "2px"};

  @media (max-width: 600px) {
    max-width: 85%;
  }
`;

const InvisibleDiv = styled.div``;

const Username = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.55);
`;

const StyledImg = styled.img`
  cursor: pointer;
`;

const FormattedDate = styled.div`
  font-size: 0.68rem;
  color: rgba(168, 212, 245, 0.3);
  align-self: flex-end;
  margin-top: 0.15rem;
`;

const MessageImage = styled.img`
  max-width: 180px;
  border-radius: 6px;
  cursor: pointer;
  display: block;
  border: 1px solid rgba(168, 212, 245, 0.15);
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: 600px) {
    max-width: 140px;
  }
`;

const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  color: #a8d4f5;
  text-decoration: none;
  padding: 0.25rem 0;

  &:hover {
    text-decoration: underline;
  }
`;

const MessageText = styled.div`
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.9);
`;

function Messages({ messages, user, inputRef }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const imageMessages = messages.filter((img) => img.document && img.has_image);

  const slides = imageMessages.map((m) => ({
    src: m.document,
    alt: m.document_name,
  }));

  function formatDate(date) {
    const dateInitial = new Date(date);
    const preparedDate = dateInitial.toLocaleDateString("ro-RO", {
      hour12: true,
      timeZone: "Europe/Bucharest",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return preparedDate;
  }

  function handleImageClick(document) {
    const index = imageMessages.findIndex((m) => m.document === document);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <MessagesContainer ref={inputRef}>
      {messages.map((message) => (
        <MessageBubble
          $senderType={message?.sender_type}
          key={message.created_at}
        >
          <Username>
            {user?.sender_type === "admin" ? "Admin" : user?.name}
          </Username>
          {/* image (with or without text) */}
          {message.has_image && (
            <>
              <MessageImage
                src={message.document}
                onClick={() => handleImageClick(message.document)}
              />
              {message.message && <MessageText>{message.message}</MessageText>}
            </>
          )}
          {/* document (with or without text) */}
          {message.document && !message.has_image && (
            <>
              <DocumentLink
                href={message.document}
                target="_blank"
                rel="noreferrer"
              >
                {message.document_name}
              </DocumentLink>
              {message.message && <MessageText>{message.message}</MessageText>}
            </>
          )}
          {/* text only */}
          {!message.has_image && !message.document && message.message && (
            <MessageText>{message.message}</MessageText>
          )}
          <FormattedDate>{formatDate(message.created_at)}</FormattedDate>
        </MessageBubble>
      ))}
      {/* <InvisibleDiv ref={inputRef} /> */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </MessagesContainer>
  );
}

export default Messages;
