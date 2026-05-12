import supabase from "./supabase";
import { WEBSITE_ID } from "../../config";

export async function getBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("website_id", WEBSITE_ID)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getBlogPostBySlug(slug) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("website_id", WEBSITE_ID)
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createBlogPost(post) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...post, website_id: WEBSITE_ID })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateBlogPost({ id, ...updates }) {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteBlogPost(id) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function uploadBlogImage({ file, websiteId, slug }) {
  const filePath = `${websiteId}/blog/${slug}`;

  // delete existing if any
  await supabase.storage.from("website-assets").remove([filePath]);

  const { error: uploadError } = await supabase.storage
    .from("website-assets")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage
    .from("website-assets")
    .getPublicUrl(filePath);

  return `${urlData.publicUrl}?t=${Date.now()}`;
}
