import styled from "styled-components";
import Modal from "./Modal";
import DeleteModalInner from "./DeleteModalInner";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import ReplyModalInner from "./ReplyModalInner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledRequest = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid grey;
  padding: 1.25rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const StyledUl = styled.ul`
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  list-style: none;
  width: 100%;
`;

const StyledLi = styled.li`
  padding: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: auto;
`;

const StyledButton = styled.button`
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: #fff;
  background-color: #88304e;
`;

const ReplyButton = styled.button`
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: #fff;
  background-color: #408a71;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`;

function Request({ name, email, message, date, id, onDelete, mutateSub }) {
  const formattedDate = new Intl.DateTimeFormat("ro-RO", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));

  return (
    <StyledRequest className="mb-3">
      <StyledUl>
        <StyledLi className="list-group-item">
          <span>
            <strong>Nume: </strong>
          </span>
          <span>{name}</span>
        </StyledLi>
        <StyledLi class="StyledList-group-item">
          <span>
            <strong>Email: </strong>
          </span>
          <span>{email}</span>
        </StyledLi>
        <StyledLi class="list-group-item">
          <span>
            <strong>Mesaj: </strong>
          </span>
          <span>{message}</span>
        </StyledLi>
        <StyledLi class="list-group-item">
          <span>
            <strong>Dată: </strong>
          </span>
          <span>{formattedDate}</span>
        </StyledLi>
      </StyledUl>
      <ActionButtons>
        {/* Delete Button */}
        <Modal>
          <Modal.Open opens="delete-confirmation">
            <StyledButton>Șterge</StyledButton>
          </Modal.Open>
          <Modal.Window
            name="delete-confirmation"
            title="Confirmare acțiune"
            size="small"
          >
            <DeleteModalInner id={id} mutateSub={mutateSub} />
          </Modal.Window>
        </Modal>
        {/* Reply to Email Button */}
        <Modal>
          <Modal.Open opens="reply-modal">
            <ReplyButton>
              <div>
                <FontAwesomeIcon icon={faReply} />
              </div>
              <div>Răspunde</div>
            </ReplyButton>
          </Modal.Open>
          <Modal.Window name="reply-modal" title="Solicitare" size="large">
            <ReplyModalInner email={email} name={name} />
          </Modal.Window>
        </Modal>
      </ActionButtons>
    </StyledRequest>
  );
}

export default Request;
