import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success("User account successfully updated");
      queryClient.setQueryData(["user"], user); // cập nhật bộ nhớ đệm, và cập nhật không cần phải render lại(bằng cách loading page)
      // queryClient.invalidateQueries({
      //   queryKey: ["user"], //queryKey user đã được thiết lập từ trước đó giờ chỉ cập nhật
      // });
    },
    onError: (err) => toast.error(err.message),
  });
  return { updateUser, isUpdating };
}
