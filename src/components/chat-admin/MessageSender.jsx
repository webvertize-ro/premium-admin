import {
  faFile,
  faPaperclip,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const StyledMessageSender = styled.div`
  background: rgba(11, 34, 64, 0.85);
  border-top: 1px solid rgba(168, 212, 245, 0.1);
  padding: 0.6rem 0.75rem;
  flex-shrink: 0;
`;

const AttachementPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  margin-bottom: 0.5rem;
  background: rgba(168, 212, 245, 0.06);
  border: 1px solid rgba(168, 212, 245, 0.12);
  border-radius: 6px;
`;

const DismissAttachment = styled.button`
  background: transparent;
  border: none;
  color: rgba(168, 212, 245, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  margin-left: auto;
  flex-shrink: 0;
  transition: color 0.15s ease;
  &:hover {
    color: #fca5a5;
  }
`;

const PreviewImg = styled.img`
  border-radius: 4px;
  border: 1px solid rgba(168, 212, 245, 0.15);
  display: block;
`;

const AttachmentName = styled.div`
  font-size: 0.78rem;
  color: rgba(168, 212, 245, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-decoration: ellipsis;
  min-width: 0;
`;

const DocumentIcon = styled.div`
  color: rgba(168, 212, 245, 0.6);
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
  align-items: center;
`;

const MessageInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: #fff;
  }

  &:focus {
    outline: none;
    border-color: rgba(168, 212, 245, 0.5);
    background: rgba(255, 255, 255, 0.09);
  }
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: transparent;
  color: rgba(168, 212, 245, 0.6);
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(168, 212, 245, 0.08);
    color: rgba(168, 212, 245, 0.9);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.3);
  background: rgba(168, 212, 245, 0.12);
  color: rgba(168, 212, 245, 0.9);
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(168, 212, 245, 0.2);
    border-color: rgba(168, 212, 245, 0.2);
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function MessageSender({ selectedUser, mutateMsg, isSending, scrollToBottom }) {
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [attachmentHasImage, setAttachmentHasImage] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  function handleFileSelect(file) {
    if (!file) return;
    setAttachment(file);
    const isImage = file.type.startsWith("image/");
    setAttachmentHasImage(isImage);
    setPreviewUrl(isImage ? URL.createObjectURL(file) : null);
  }

  function handleDismissAttachment() {
    setAttachment(null);
    setPreviewUrl(null);
    setAttachmentHasImage(false);
  }

  function onSubmit(data) {
    mutateMsg({
      ...data,
      user_id: selectedUser,
      sender_type: "admin",
      document: attachment,
    });

    reset();
    setAttachment(null);
    setPreviewUrl(null);
    setAttachmentHasImage(false);
    setTimeout(() => scrollToBottom(), attachmentHasImage ? 2000 : 1500);
  }

  return (
    <StyledMessageSender>
      {attachment && (
        <AttachementPreview>
          {attachmentHasImage ? (
            <PreviewImg src={previewUrl} width="48" height="48" />
          ) : (
            <DocumentIcon>
              <FontAwesomeIcon icon={faFile} />
            </DocumentIcon>
          )}
          <AttachmentName>{attachment.name}</AttachmentName>
          <DismissAttachment onClick={handleDismissAttachment}>
            <FontAwesomeIcon icon={faXmark} />
          </DismissAttachment>
        </AttachementPreview>
      )}

      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <FileLabel htmlFor="document">
          <FontAwesomeIcon icon={faPaperclip} />
        </FileLabel>

        <FileInput
          type="file"
          id="document"
          name="document"
          {...register("document")}
          onChange={(e) => {
            handleFileSelect(e.target.files[0]);
            e.target.value = null;
          }}
        />
        <MessageInput
          type="text"
          {...register("message")}
          placeholder="Scrieți răspunsul aici..."
        />
        <SendButton type="submit" disabled={isSending}>
          <FontAwesomeIcon icon={isSending ? null : faPaperPlane} />
          {isSending && <LoadingSpinner color="light" />}
        </SendButton>
      </StyledForm>
    </StyledMessageSender>
  );
}

export default MessageSender;
