import { $user } from "@/store/user";
import { Button, Divider, Grid, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

const initialValues = {
  username: "",
  displayName: "",
  email: "",
};

export default function AccountTab() {
  const form = useForm({
    initialValues,
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if ($user != null) {
      console.log($user.get());
      form.setValues({
        username: $user.get().username,
        displayName: $user.get().displayName,
        email: $user.get().email,
      });
    }
  }, [$user]);

  return (
    <div className="user-profile-page px-6">
      <div>Hồ sơ của tôi</div>
      <div className="text-sm">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </div>
      {/* <Divider className="mt-4" /> */}
      <form className="mt-8">
        <div>
          <Grid align="center">
            <Grid.Col span={2} className="text-end mb-4">
              Username:
            </Grid.Col>
            <Grid.Col span={9} className="mb-4">
              <TextInput
                autoComplete="username"
                {...form.getInputProps("username")}
              />
            </Grid.Col>
            <Grid.Col span={2} className="text-end mb-4">
              Display name:
            </Grid.Col>
            <Grid.Col span={9} className="mb-4">
              <TextInput
                autoComplete="username"
                {...form.getInputProps("displayName")}
              />
            </Grid.Col>
            <Grid.Col span={2} className="text-end">
              Email:
            </Grid.Col>
            <Grid.Col span={9}>
              {" "}
              <TextInput
                autoComplete="email"
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={11} className="text-end mt-2">
              <Button className="bg-primary !text-white">Update</Button>
            </Grid.Col>
          </Grid>
        </div>
      </form>
    </div>
  );
}
