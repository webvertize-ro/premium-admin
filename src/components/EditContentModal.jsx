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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: rgba(11, 34, 64, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(168, 212, 245, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 520px;
  overflow-y: auto;
  position: relative;
  color: #fff;

  @media (max-width: 600px) {
    padding: 1.25rem 1rem;
    max-height: 85vh;
  }
`;

const ModalTop = styled.div``;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 1px solid rgba(168, 212, 245, 0.2);
  border-radius: 6px;
  color: rgba(168, 212, 245, 0.6);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
  padding: 0;

  &:hover {
    background: rgba(168, 212, 245, 0.1);
    color: #fff;
  }
`;

const ModalTitle = styled.h5`
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fff;
  margin: 0 0 0.25rem;
  padding-right: 2rem;
`;

const FieldMeta = styled.p`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
  margin: 0 0 1.25rem;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 1.25rem;
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

const FieldLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
  margin-bottom: 0.35rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: border-color 0.15s ease;

  option {
    background: #0f2f5a;
    color: #fff;
  }

  &:focus {
    outline: none;
    border-color: rgba(168, 212, 245, 0.5);
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
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

const HiddenFileInput = styled.input`
  display: none;
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
  background: rgba(220, 37, 37, 0.15);
  border: 1px solid rgba(220, 37, 37, 0.35);
  border-radius: 50%;
  color: #f87171;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: background 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(220, 37, 37, 0.3);
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 0.75rem;
`;

const StyledImg = styled.img`
  max-width: 160px;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.15);
  display: block;
  margin-top: 0.4rem;
`;

const UploadButtonContainer = styled.div`
  display: flex;
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.3);
  background: transparent;
  color: rgba(168, 212, 245, 0.8);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  margin-bottom: 1.25rem;

  &:hover {
    background: rgba(168, 212, 245, 0.1);
    color: #fff;
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  padding: 0.45rem 1.25rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.2);
  background: transparent;
  color: rgba(168, 212, 245, 0.6);
  font-size: 0.78;
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

const SaveBtn = styled.button`
  padding: 0.45rem 1.25rem;
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
  font-size: 0.72;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
`;

const CurrentPdfLink = styled.a`
  display: inline-block;
  font-size: 0.85rem;
  color: #a8d4f5;
  text-decoration: none;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(168, 212, 245, 0.8);
  margin-bottom: 0.75rem;

  strong {
    color: #fff;
  }
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

  const ref = useOutsideClick(onClose);

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
        <FieldMeta>
          {field?.page} › {field?.section}
        </FieldMeta>

        {field?.content_type === "text" ? (
          <StyledTextarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={4}
          />
        ) : field?.content_type === "social_link" ? (
          <div>
            <FieldLabel>Platformă</FieldLabel>
            <StyledSelect
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value)}
            >
              {platformOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </StyledSelect>

            <FieldLabel>Link</FieldLabel>
            <StyledInput
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
                <FieldLabel>Fișier actual:</FieldLabel>
                <CurrentPdfLink
                  href={field.value}
                  target="_blank"
                  rel="noreferrer"
                >
                  Vizualizează PDF actual
                </CurrentPdfLink>
              </div>
            )}

            {pdfFile && (
              <SelectedFile>
                Fișier selectat: <strong>{pdfFile.name}</strong>
                <DismissButton onClick={() => setPdfFile(null)}>
                  <StyledFontAwesomeIcon icon={faXmark} />
                </DismissButton>
              </SelectedFile>
            )}

            <UploadButtonContainer>
              <UploadLabel htmlFor="pdf-file">
                <FontAwesomeIcon icon={faUpload} />
                <span>Încarcă PDF</span>
              </UploadLabel>
              <HiddenFileInput
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
              <UploadLabel htmlFor="video-file">
                <span>
                  <FontAwesomeIcon icon={faUpload} />
                </span>
                <span>Încarcă video</span>
              </UploadLabel>
              <HiddenFileInput
                id="video-file"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  setVideoPreviewUrl(url);
                  setVideoFile(file);
                  e.target.value = null;
                }}
              />
            </UploadButtonContainer>
          </div>
        ) : (
          <div>
            <ImageChange>
              <CurrentImage>
                <FieldLabel>Imaginea actuala: </FieldLabel>
                <StyledImg src={field?.value} alt={field?.label} />
              </CurrentImage>

              {previewUrl && (
                <NewImage>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <FieldLabel>Imagine nouă</FieldLabel>
                    <DismissButton onClick={() => setPreviewUrl("")}>
                      <StyledFontAwesomeIcon icon={faXmark} />
                    </DismissButton>
                  </div>

                  <StyledImg src={previewUrl} alt="" />
                </NewImage>
              )}
            </ImageChange>

            <UploadButtonContainer>
              <UploadLabel htmlFor="image">
                <span>
                  <FontAwesomeIcon icon={faUpload} />
                </span>
                <span>Încarcă imagine</span>
              </UploadLabel>
              <HiddenFileInput
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
