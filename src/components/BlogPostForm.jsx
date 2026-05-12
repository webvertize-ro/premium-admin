import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBlogPost, useUpdateBlogPost } from "../hooks/useBlogPosts";
import { slugify } from "../utils/slugify";
import toast from "react-hot-toast";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faPenToSquare,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { uploadBlogImage } from "../services/apiBlog";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StyledImg = styled.img`
  max-width: 60px;
`;

const InfoElement = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CancelButton = styled.button`
  border: none;
  background-color: #750e21;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const SaveButton = styled.button`
  border: none;
  background-color: #1e5128;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const UploadImageLabel = styled.label`
  background-color: #093c5d;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #fff;
  margin-top: 0.5rem;
  cursor: pointer;
`;

function BlogPostForm({ post, onClose, onCloseModal }) {
  const isEditing = !!post;
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: post ?? {
      title: "",
      short_description: "",
      body: "",
      author: "",
      is_published: false,
    },
  });

  // image management
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(post?.cover_image_url || null);

  const { mutate: createPost, isPending: isCreating } = useCreateBlogPost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdateBlogPost();
  const isPending = isCreating || isUpdating;

  // auto-generate slug from title when creating
  const title = watch("title");
  useEffect(() => {
    if (!isEditing) {
      setValue("slug", slugify(title));
    }
  }, [title, isEditing, setValue]);

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = null;
  }

  async function onSubmit(data) {
    try {
      let coverImageUrl = post?.cover_image_url || null;

      // if a new image was selected, upload it first
      if (imageFile) {
        coverImageUrl = await uploadBlogImage({
          file: imageFile,
          websiteId: data.website_id || post?.website_id,
          slug: data.slug,
        });
      }

      const postData = { ...data, cover_image_url: coverImageUrl };

      if (isEditing) {
        updatePost(
          { id: post.id, ...postData },
          {
            onSuccess: () => {
              toast.success("Articol actualizat!");
              onClose();
            },
            onError: () => toast.error("Eroare la actualizare"),
          },
        );
      } else {
        createPost(postData, {
          onSuccess: () => {
            toast.success("Articol creat!");
            onClose();
          },
          onError: () => toast.error("Eroare la creare"),
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <h3>{isEditing ? "Editeaza articol" : "Articol nou"}</h3>

        {/* image section */}
        <div>
          <label>Imagine articol</label>
          {previewUrl ? (
            <div>
              <img
                src={previewUrl}
                alt="Cover articol"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
              <div>
                <UploadImageLabel htmlFor="blog-image">
                  <FontAwesomeIcon icon={faPenToSquare} />
                  Schimbă imaginea
                </UploadImageLabel>
              </div>
            </div>
          ) : (
            <div>
              <UploadImageLabel
                htmlFor="blog-image"
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faUpload} />
                Încarcă imagine
              </UploadImageLabel>
            </div>
          )}
          <input
            id="blog-image"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Titlu</label>
          <input
            className="form-control"
            {...register("title")}
            placeholder="Titlul articolului"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Slug (URL)</label>
          <input
            className="form-control"
            {...register("slug")}
            placeholder="titlul-articolului"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descriere scurta</label>
          <input
            className="form-control"
            {...register("short_description")}
            rows={2}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Autor</label>
          <input
            className="form-control"
            {...register("author")}
            placeholder="Numele autorului"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Continut articol</label>
          <InfoElement>
            <div>
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
            <div>Pentru a marca un nou paragraf, lăsați un rând liber.</div>
          </InfoElement>
          <textarea className="form-control" {...register("body")} rows={5} />
        </div>
        <div className="mb-3 form-check">
          <label className="form-check-label">
            <input
              type="checkbox"
              {...register("is_published")}
              className="form-check-input"
            />
            Publicat
          </label>
        </div>

        <ActionButtons>
          <CancelButton type="button" onClick={onClose} disabled={isPending}>
            Anuleaza
          </CancelButton>

          <SaveButton type="submit" disabled={isPending}>
            {isPending ? "Se salveaza..." : "Salveaza"}
          </SaveButton>
        </ActionButtons>
      </StyledForm>
    </div>
  );
}

export default BlogPostForm;
