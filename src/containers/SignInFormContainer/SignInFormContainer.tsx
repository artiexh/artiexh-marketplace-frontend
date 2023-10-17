import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import { User } from "@/types/User";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useState } from "react";

const initialValues = {
  username: "",
  password: "",
};

type FormValues = typeof initialValues;

const validate = {
  username: (value: string) =>
    value.trim().length > 0 ? null : "Username cannot be empty",
  password: (value: string) =>
    value.trim().length > 0 ? null : "Password cannot be empty",
};

const SignInFormContainer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues,
    validate,
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    if (!form.isValid()) return;
    try {
      const { password, username } = values;
      const { data } = await axiosClient.post<User>("/auth/login", {
        password,
        username,
      });
      console.log(data);
      // TODO:
      // Save this
      router.push(ROUTE.HOME_PAGE);
    } catch (error) {
      // TODO:
      // Handle 401 invalid credentials
      console.log(error);
      form.setErrors({
        username: "Invalid credentials",
        password: "Invalid credentials",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="max-w-xs mx-auto flex flex-col gap-3 sm:gap-5 sm:bg-white bg-accent w-full sm:flex-1"
      onSubmit={form.onSubmit(onSubmit)}
    >
      <TextInput
        label="Username"
        placeholder="username nè"
        disabled={isSubmitting}
        autoComplete="username"
        {...form.getInputProps("username")}
      />
      <PasswordInput
        label="Mật khẩu"
        placeholder="Siêu bí mật"
        disabled={isSubmitting}
        autoComplete="password"
        {...form.getInputProps("password")}
      />

      <Button type="submit" className="bg-primary" disabled={isSubmitting}>
        Đăng nhập
      </Button>
    </form>
  );
};

export default SignInFormContainer;
