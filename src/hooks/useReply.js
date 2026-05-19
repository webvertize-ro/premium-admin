import { useMutation } from "@tanstack/react-query";
import { sendReply } from "../services/apiReply";
import toast from "react-hot-toast";

export function useReply() {
  return useMutation({
    mutationFn: sendReply,
    onSuccess: () => {
      toast.success("Raspuns trimis cu succes!");
    },
    onError: (error) => {
      toast.error(error.message || "Eroare la trimiterea raspunsului");
    },
  });
}
