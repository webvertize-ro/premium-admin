import { useState } from "react";
import styled from "styled-components";
import Lightbox, { LightboxRoot } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
  max-height: 60vh;
  gap: 0.5rem;
  padding: 1.5rem;
  overflow-y: scroll;
  height: 100%;
  background-color: #f0f0f0;
`;

const InvisibleDiv = styled.div``;

const MessageBubble = styled.div`
  background-color: ${(props) =>
    props.$senderType === "admin" ? "#468432" : "#81A6C6"};
  align-self: ${(props) => (props.$senderType === "user" ? "start" : "end")};
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const Username = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
`;

const StyledImg = styled.img`
  cursor: pointer;
`;

const FormattedDate = styled.div`
  font-weight: 700;
  font-size: 0.8rem;
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
          {/* image + text */}
          {message.has_image && message.message && (
            <div>
              <StyledImg
                src={message.document}
                className="img-fluid"
                width="120"
                onClick={() => {
                  const index = imageMessages.findIndex(
                    (m) => m.document === message.document,
                  );
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              />
              <div>{message.message}</div>
            </div>
          )}
          {/* image */}
          {message.has_image && !message.message && (
            <div>
              <StyledImg
                src={message.document}
                className="img-fluid"
                width="120"
                onClick={() => {
                  const index = imageMessages.findIndex(
                    (m) => m.document === message.document,
                  );
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              />
            </div>
          )}
          {/* doc + text */}
          {message.document && !message.has_image && message.message && (
            <div>
              <a href={message.document} target="_blank">
                {message.document_name}
              </a>
              <div>{message.message}</div>
            </div>
          )}
          {/* doc */}
          {message.document && !message.has_image && !message.message && (
            <div>
              <a href={message.document} target="_blank">
                {message.document_name}
              </a>
            </div>
          )}
          {/* text */}
          {!message.has_image && !message.document && message.message && (
            <div>{message.message}</div>
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
