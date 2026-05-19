import { useForm } from "react-hook-form";
import { useReply } from "../hooks/useReply";
import styled from "styled-components";

const StyledReplyModalInner = styled.div`
  padding: 1.5rem 4rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
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
      <h4>Raspunde la solicitare</h4>
      <p>
        Solicitare de la: <strong>{name}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Către</label>
          <input {...register("to")} readOnly className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Subiect</label>
          <input {...register("subject")} className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Mesaj</label>
          <textarea
            {...register("message")}
            rows={8}
            className="form-control"
          />
        </div>

        <ActionButtons>
          <SendReply type="submit" disabled={isPending}>
            {isPending ? "Se trimite..." : "Trimite raspuns"}
          </SendReply>
          <CancelBtn type="button" onClick={onCloseModal} disabled={isPending}>
            Anuleaza
          </CancelBtn>
        </ActionButtons>
      </form>
    </StyledReplyModalInner>
  );
}

export default ReplyModalInner;
