import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateBlogPost, useUpdateBlogPost } from "../hooks/useBlogPosts";
import { slugify } from "../utils/slugify";
import toast from "react-hot-toast";

function BlogPostForm({ post, onClose }) {
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

  function onSubmit(data) {
    if (isEditing) {
      updatePost(
        { id: post.id, ...data },
        {
          onSuccess: () => {
            toast.success("Articol actualizat!");
            onClose();
          },
          onError: () => toast.error("Eroare la actualizare"),
        },
      );
    } else {
      createPost(data, {
        onSuccess: () => {
          toast.success("Articol creat!");
          onClose();
        },
        onError: () => toast.error("Eroare la creare"),
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>{isEditing ? "Editeaza articol" : "Articol nou"}</h3>

        <label>Titlu</label>
        <input {...register("title")} placeholder="Titlul articolului" />

        <label>Slug (URL)</label>
        <input {...register("slug")} placeholder="titlul-articolului" />

        <label>Descriere scurta</label>
        <input {...register("short_description")} rows={2} />

        <label>Autor</label>
        <input {...register("author")} placeholder="Numele autorului" />

        <label>Continut articol</label>
        <input {...register("body")} rows={10} />

        <label>
          <input type="checkbox" {...register("is_published")} />
          Publicat
        </label>

        <button type="button" onClick={onClose} disabled={isPending}>
          Anuleaza
        </button>

        <button type="submit" disabled={isPending}>
          {isPending ? "Se salveaza..." : "Salveaza"}
        </button>
      </form>
    </div>
  );
}

export default BlogPostForm;
