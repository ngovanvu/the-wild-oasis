import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
  //đưa dữ liệu vào cache sử dụng useQUery để dễ dàng tái sử dụng user
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser, //lưu trữu dữ liệu của hàm này trả về vào trong key có tên là "user"
  });
  return { isLoading, user, isAuthenticated: user?.role === "authenticated" };
}
//isLoading: Biến này lưu trữ trạng thái tải (true nếu đang tải dữ liệu xác thực, false nếu đã tải xong).
// isAuthenticated: Biến này lưu trữ trạng thái xác thực của người dùng (true nếu người dùng đã được xác thực, false nếu chưa).
