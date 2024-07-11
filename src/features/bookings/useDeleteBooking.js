import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteBooking } = useMutation({
    // mutationFn: (id) => deleteCabinApi(id),
    mutationFn: deleteBookingApi,
    // vộ hiệu để dữ liệu có thể chuyển thành refetch => đê tự cập nhật dữ liệu nào đã bị xóa
    //liên kết với  const queryClient = new QueryClient ở bên App
    onSuccess: () => {
      toast.success("booking successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteBooking };
}
