import { useMutation } from "@tanstack/react-query";
import React from "react";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      //   console.log("useSignup", user);
      toast.success("Account successfully created! Please verufy the new account from the user's email address");
    },
  });
  return { signup, isLoading };
}
