import { useForm } from "react-hook-form";
import { useReply } from "../hooks/useReply";
import styled from "styled-components";
import { Modal } from "bootstrap";
import { Form } from "react-router-dom";

const StyledReplyModalInner = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalHeading = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fff;
  margin: 0;
`;

const SenderInfo = styled.p`
  font-size: 0.8rem;
  color: rgba(168, 212, 245, 0.45);
  margin: 0;

  strong {
    color: rgba(168, 212, 245, 0.8);
    font-weight: 600;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FormGroup = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
`;

const FormLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.875rem;
  transition: border-color 0.15s ease;

  &:read-only {
    opacity: 0.5;
    cursor: default;
  }

  &:focus {
    outline: none;
    border-color: rgba(168, 212, 245, 0.5);
    background: rgba(255, 255, 255, 0.09);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 1px solid rgba(168, 212, 245, 0.2);
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: rgba(168, 212, 245, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(168, 212, 245, 0.5);
    background: rgba(255, 255, 255, 0.09);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.25rem;
`;

const SendButton = styled.button`
  flex: 1;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.4);
  background: rgba(168, 212, 245, 0.14);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(168, 212, 245, 0.22);
    border-color: rgba(168, 212, 245, 0.6);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: transparent;
  color: rgba(168, 212, 245, 0.6);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(168, 212, 245, 0.08);
    color: rgba(168, 212, 245, 0.9);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SendReply = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #234c6a;
  color: #fff;
  flex: 1;
`;

const CancelBtn = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #be3144;
  color: #fff;
  flex: 1;
`;

function ReplyModalInner({ email, name, onCloseModal }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      to: email,
      subject: `Răspuns la solicitarea dumneavoastră`,
      message: `Bună ziua, ${name}, \n`,
    },
  });

  const { mutate: sendReply, isPending } = useReply();

  function onSubmit(data) {
    sendReply(data, {
      onSuccess: () => onCloseModal(),
    });
  }

  return (
    <StyledReplyModalInner>
      <ModalHeading>Răspunde la solicitare</ModalHeading>
      <SenderInfo>
        Solicitare de la: <strong>{name}</strong>
      </SenderInfo>

      <StyledForm>
        <FormGroup>
          <FormLabel>Către</FormLabel>
          <FormInput {...register("to")} />
        </FormGroup>

        <FormGroup>
          <FormLabel>Subiect</FormLabel>
          <FormInput {...register("subject")} />
        </FormGroup>

        <FormGroup>
          <FormLabel>Mesaj</FormLabel>
          <FormTextarea {...register("message")} rows={8} />
        </FormGroup>

        <ActionButtons>
          <SendButton type="submit" disabled={isPending}>
            {isPending ? "Se trimite..." : "Trimite răspuns"}
          </SendButton>

          <CancelButton
            type="button"
            onClick={onCloseModal}
            disabled={isPending}
          >
            Anulează
          </CancelButton>
        </ActionButtons>
      </StyledForm>
    </StyledReplyModalInner>
  );
}

export default ReplyModalInner;
