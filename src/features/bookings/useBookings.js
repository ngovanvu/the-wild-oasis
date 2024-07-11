import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient(); //PRE-FETCHING

  // sử dụng searchParams để lấy giá trị khi click vào và truyền vào cho hàm getBookings
  // để có thể truyền giá trị filter đi sử dụng để có thể truy cập lọc thẳng ở trong API Supabase
  const [searchParams] = useSearchParams();
  //FIlter
  const filterValue = searchParams.get("status");
  const filter = !filterValue || filterValue === "all" ? null : { field: "status", value: filterValue };
  // { field: "totalPrice", value: 5000, method: "gte" };

  //SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");

  const sortBy = { field, direction };

  // Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  //QUERY lưu vao cache
  const {
    isLoading,
    data: { data: bookings, count } = {},
    // Điều này đảm bảo rằng nếu data không tồn tại hoặc là undefined, thì data sẽ được gán giá trị mặc định là một đối tượng rỗng {}, giúp tránh lỗi khi cố gắng truy cập vào các thuộc tính của undefined.
    // bookings sẽ là undefined, count sẽ là undefined
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page], //queryKey thuộc React Query nên khi filter hay  bookings  thay đổi thì React Query sẽ tìm nạp lại liệu
    // queryFn: getBookings,
    queryFn: () => getBookings({ filter, sortBy, page }), //{ filter, sortBy, page } truyền giá trị cho bên Function dùng
  });

  //Tăng Chất lượng người dùng PRE-FETCHING (page + 1 ở đây là để fetching trước một page Pagination ví dụ như đang ở page 5 thì đã fetching trước trang số 6)
  const pageCount = Math.ceil(count / PAGE_SIZE);
  //page < pageCount điều kiện ở đây vì trong bảng useQuery ở Web nó hiển thị fetching thêm một trang ở cuối page nó không cần thiêt
  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1], //queryKey thuộc React Query nên khi filter hay  bookings  thay đổi thì React Query sẽ tìm nạp lại liệu
      // queryFn: getBookings,
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }), //{ filter, sortBy, page } truyền giá trị cho bên Function dùng
    });
  }
  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1], //queryKey thuộc React Query nên khi filter hay  bookings  thay đổi thì React Query sẽ tìm nạp lại liệu
      // queryFn: getBookings,
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }), //{ filter, sortBy, page } truyền giá trị cho bên Function dùng
    });
  }

  return { isLoading, error, bookings, count };
}
