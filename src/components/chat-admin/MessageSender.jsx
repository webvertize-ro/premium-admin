import {
  faFile,
  faPaperclip,
  faPaperPlane,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import previewImgTest from '../../assets/preview_image.avif';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 12fr 1fr;
  gap: 0.5rem;
  border-top: 1px solid black;
`;

const PreviewFile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid orange;
  padding: 0.5rem;
`;

const StyledButton = styled.button`
  background: transparent;
  border: none;
  align-self: end;
`;

const PreviewImgContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreviewImg = styled.img``;

const Document = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  color: #000;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
`;

const Input = styled.input``;

const FileLabel = styled.label`
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid lime;
`;

const FileInput = styled.input`
  display: none;
`;

const SendButton = styled.button`
  background-color: transparent;
  border: none;
  border: 1px solid lime;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function MessageSender({ selectedUser, mutateMsg, isSending, scrollToBottom }) {
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [attachmentHasImage, setAttachmentHasImage] = useState(null);

  console.log('attachment is: ', attachment);

  const { register, handleSubmit, reset, formState } = useForm();

  const { errors } = formState;

  if (errors) {
    console.log(errors);
  }

  function handleFileSelect(file) {
    setAttachmentHasImage(file?.type?.startsWith('image/') || false);
    if (!file) return;
    setAttachment(file);

    // create a URL if the file is an image
    if (file.type.startsWith('image/')) {
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
    } else {
      setPreviewUrl(null);
    }
  }

  function onSubmit(data) {
    const message = {
      ...data,
      user_id: selectedUser,
      sender_type: 'admin',
      document: attachment,
    };
    reset();
    setAttachment(null);
    setTimeout(() => scrollToBottom(), attachmentHasImage ? 2000 : 1500);
    mutateMsg(message);
  }

  function onError(errors) {
    console.log(errors);
  }
  return (
    <div>
      {attachment && (
        <PreviewFile>
          <StyledButton onClick={() => setAttachment(null)}>
            <FontAwesomeIcon icon={faXmark} />
          </StyledButton>
          {/* image || document */}
          {attachment?.type.startsWith('image/') ? (
            <PreviewImgContainer>
              <PreviewImg src={previewUrl} width="60" className="img-fluid" />
              <div>{attachment.name}</div>
            </PreviewImgContainer>
          ) : (
            <Document href={'cool_file.pdf'}>
              <StyledFontAwesomeIcon icon={faFile} />
              <div>{attachment.name}</div>
            </Document>
          )}
        </PreviewFile>
      )}
      <StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
        <FileLabel htmlFor="document">
          <FontAwesomeIcon icon={faPaperclip} />
        </FileLabel>
        <FileInput
          type="file"
          id="document"
          name="document"
          {...register('document')}
          onChange={(e) => {
            handleFileSelect(e.target.files[0]);
            e.target.value = null;
          }}
        />
        <Input type="text" {...register('message')} className="form-control" />
        <SendButton type="submit">
          {isSending ? (
            <LoadingSpinner color="dark" />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} />
          )}
        </SendButton>
      </StyledForm>
    </div>
  );
}

export default MessageSender;
