import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../services/apiBlog";

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog_posts"],
    queryFn: getBlogPosts,
  });
}

export function useBlogPost(slug) {
  return useQuery({
    queryKey: ["blog_post", slug],
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
  });
}
