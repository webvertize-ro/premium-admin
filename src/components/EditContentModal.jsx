// components/EditContentModal.jsx
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTextContent,
  updateImageContent,
  updateFileContent,
  updateVideoContent,
} from "../services/apiContent";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faX, faXmark } from "@fortawesome/free-solid-svg-icons";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 480px;
  position: relative;
`;

const ModalTop = styled.div``;

const CloseBtn = styled.button`
  border: none;
  background-color: transparent;
  position: absolute;
  top: -0.5rem;
  right: -0.25rem;
  padding: 1rem;
`;

const ModalTitle = styled.h5`
  color: #000;
`;

const StyledP = styled.p`
  font-size: 12px;
  color: #000;
`;

const StyledTextarea = styled.textarea`
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const ImageChange = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const CurrentImage = styled.div``;

const NewImage = styled.div`
  position: relative;
`;

const NewImageText = styled.div`
  display: flex;
`;

const DismissButton = styled.button`
  background-color: transparent;
  border: none;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc2525;
  border-radius: 50%;
  color: #fff;
  display: flex;
  padding: 0.25rem;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 0.75rem;
`;

const StyledImg = styled.img`
  max-width: 200px;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
`;

const UploadButtonContainer = styled.div`
  display: flex;
`;

const StyledLabel = styled.label`
  display: flex;
  gap: 0.25rem;
  font-size: 1.2rem;
  color: black;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: #68808e;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const StyledInput = styled.input`
  margin-bottom: 1rem;
  display: none;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  background-color: #88304e;
  color: #fff;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
`;

const SaveBtn = styled.button`
  background-color: #285a48;
  color: #fff;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
`;

const VideoPreviewContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const VideoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  position: relative;
`;

const VideoColumnLabel = styled.div`
  font-family: var(--font-family);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary);
`;

const StyledVideo = styled.video`
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  background-color: var(--color-surface);
`;

function EditContentModal({ field, onClose }) {
  const { websiteId } = useAuth();
  const queryClient = useQueryClient();
  // parse the existing JSON value for social_link fields
  const parsedSocial =
    field.content_type === "social_link"
      ? JSON.parse(field.value || '{"platform": "facebook", "url": ""}')
      : null;

  const [textValue, setTextValue] = useState(field?.value);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  // state for social platform and URL (of that platform)
  const [socialPlatform, setSocialPlatform] = useState(
    parsedSocial?.platform || "facebook",
  );
  const [socialUrl, setSocialUrl] = useState(parsedSocial?.url || "");

  function handleFileSelect(file) {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageFile(file);
  }

  const { mutate: saveContent, isPending } = useMutation({
    mutationFn: (variables) => {
      if (field?.content_type === "image_url")
        return updateImageContent(variables);
      if (field?.content_type === "pdf_url")
        return updateFileContent(variables);
      if (field?.content_type === "video_url")
        return updateVideoContent(variables);
      return updateTextContent(variables);
    },
    onSuccess: () => {
      // invalidate the content query so the list refreshes
      queryClient.invalidateQueries({ queryKey: ["content", websiteId] });
      toast.success("Conținut actualizat!");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Eroare la actualizare");
    },
  });

  function handleSave() {
    if (field?.content_type === "image_url") {
      if (!imageFile) return toast.error("Selectează o imagine");
      saveContent({
        id: field?.id,
        websiteId,
        key: field?.key,
        file: imageFile,
      });
    } else if (field?.content_type === "pdf_url") {
      if (!pdfFile) return toast.error("Selecteză un fișier PDF");
      saveContent({ id: field?.id, websiteId, key: field?.key, file: pdfFile });
    } else if (field?.content_type === "video_url") {
      if (!videoFile) return toast.error("Selectează un fișier video");
      saveContent({
        id: field?.id,
        websiteId,
        key: field?.key,
        file: videoFile,
      });
    } else if (field.content_type === "social_link") {
      // serialize back to JSON string before saving
      const value = JSON.stringify({
        platform: socialPlatform,
        url: socialUrl,
      });
      saveContent({ id: field.id, value });
    } else {
      saveContent({ id: field?.id, value: textValue });
    }
  }

  const platformOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "tiktok", label: "TikTok" },
  ];

  const ref = useOutsideClick(field ? onClose : {});

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [previewUrl, videoPreviewUrl]);

  return (
    <Overlay>
      <Modal ref={ref}>
        <ModalTop>
          <CloseBtn onClick={() => onClose()}>
            <FontAwesomeIcon icon={faX} />
          </CloseBtn>
          <ModalTitle>{field?.label}</ModalTitle>
        </ModalTop>
        <StyledP>
          <strong>Conținutul editat: </strong>
          {field?.page} › {field?.section}
        </StyledP>

        {field?.content_type === "text" ? (
          <StyledTextarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={4}
          />
        ) : field?.content_type === "social_link" ? (
          <div>
            <label>Platformă</label>
            <select
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value)}
            >
              {platformOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label>Link</label>
            <input
              type="url"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder="https://facebook.com/pagina-ta"
            />
          </div>
        ) : field?.content_type === "pdf_url" ? (
          <div>
            {field?.value && (
              <div className="mb-2">
                <div className="text-dark mb-1">Fișier actual:</div>
                <a
                  href={field.value}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1b3c53", fontSize: "13px" }}
                >
                  Vizualizează PDF actual
                </a>
              </div>
            )}

            {pdfFile && (
              <div
                className="mb-2"
                style={{ fontSize: "13px", color: "#285a48" }}
              >
                Fișier selectat: <strong>{pdfFile.name}</strong>
                <button
                  onClick={() => setPdfFile(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc2525",
                    cursor: "pointer",
                    marginLeft: "0.5rem",
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            <UploadButtonContainer>
              <StyledLabel htmlFor="pdf-file">
                <span>
                  <FontAwesomeIcon icon={faUpload} />
                </span>
                <span>Încarcă PDF</span>
              </StyledLabel>
              <StyledInput
                id="pdf-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setPdfFile(e.target.files[0]);
                  e.target.value = null;
                }}
              />
            </UploadButtonContainer>
          </div>
        ) : field?.content_type === "video_url" ? (
          <div>
            <VideoPreviewContainer>
              {/* Current video */}
              {field?.value && (
                <VideoColumn>
                  <VideoColumnLabel>Video actual:</VideoColumnLabel>
                  <StyledVideo src={field.value} controls muted />
                </VideoColumn>
              )}

              {/* New video preview */}
              {videoPreviewUrl && (
                <VideoColumn>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <VideoColumnLabel>Video nou:</VideoColumnLabel>
                    <DismissButton
                      onClick={() => {
                        setVideoPreviewUrl(null);
                        setVideoFile(null);
                      }}
                    >
                      <StyledFontAwesomeIcon icon={faXmark} />
                    </DismissButton>
                  </div>
                  <StyledVideo src={videoPreviewUrl} controls muted />
                </VideoColumn>
              )}
            </VideoPreviewContainer>

            <UploadButtonContainer>
              <StyledLabel htmlFor="video-file">
                <span>
                  <FontAwesomeIcon icon={faUpload} />
                </span>
                <span>Încarcă video</span>
              </StyledLabel>
              <StyledInput
                id="video-file"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  setVideoPreviewUrl(url);
                  setVideoFile(file);
                  e.target.value = nulll;
                }}
              />
            </UploadButtonContainer>
          </div>
        ) : (
          <div>
            <ImageChange className="mb-2">
              <CurrentImage>
                <div className="text-dark">Imaginea actuala: </div>

                <StyledImg
                  src={field?.value}
                  alt={field?.label}
                  className="img-fluid"
                />
              </CurrentImage>
              {previewUrl && (
                <NewImage>
                  <div className="d-flex justify-content-between ">
                    <NewImageText className="text-dark">
                      Noua imagine:{" "}
                    </NewImageText>
                    <DismissButton onClick={() => setPreviewUrl("")}>
                      <StyledFontAwesomeIcon icon={faXmark} />
                    </DismissButton>
                  </div>

                  <StyledImg src={previewUrl} alt="" className="img-fluid" />
                </NewImage>
              )}
            </ImageChange>

            <UploadButtonContainer>
              <StyledLabel htmlFor="image">
                <span>
                  <FontAwesomeIcon icon={faUpload} />
                </span>
                <span>Încarcă imagine</span>
              </StyledLabel>
              <StyledInput
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileSelect(e.target.files[0]);
                  e.target.value = null;
                }}
              />
            </UploadButtonContainer>
          </div>
        )}

        <ActionButtonsContainer>
          <CancelBtn onClick={onClose} disabled={isPending}>
            Anulează
          </CancelBtn>
          <SaveBtn onClick={handleSave} disabled={isPending}>
            {isPending ? "Se salvează..." : "Salvează"}
          </SaveBtn>
        </ActionButtonsContainer>
      </Modal>
    </Overlay>
  );
}

export default EditContentModal;
