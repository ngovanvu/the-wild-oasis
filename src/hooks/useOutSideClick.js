import { useEffect, useRef } from "react";

function useOutSideClick(handleClose, listenCapturing = true) {
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(e) {
        //ref.current là cửa sổ trắng && ref.current.contains(e.target) (e.target là value của nơi mình kích vào) chuột kích vào ô màu trắng
        if (ref.current && !ref.current.contains(e.target)) {
          //   console.log("click outside");
          handleClose();
        }
      }
      document.addEventListener("click", handleClick, listenCapturing);

      return () => document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handleClose, listenCapturing]
  );

  return ref;
}

export default useOutSideClick;
