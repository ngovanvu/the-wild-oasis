import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      // console.log("useLoginUser", user); 1 object có 2 thuộc tính là session và user
      queryClient.setQueryData(["user"], user.user); //!để bên reac useUser.js không cần phải lấy 1 lần nữa, có thể set được data vào bộ nhớ đệm react query
      //   console.log("user", user);
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      //   console.log("Error", err);
      toast.error("Provided email or password are incorrect");
    },
  });

  return { login, isLoading };
}
