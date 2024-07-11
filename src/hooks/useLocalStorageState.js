import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
//Custom hook useLocalStorageState giúp quản lý state
// và đồng bộ hóa state đó với localStorage.
//Điều này hữu ích cho các ứng dụng cần lưu trữ trạng thái của người dùng giữa các lần tải lại trang.
// Khi giá trị state thay đổi, nó sẽ tự động được lưu trữ trong localStorage
//và được phục hồi khi người dùng truy cập lại trang.
