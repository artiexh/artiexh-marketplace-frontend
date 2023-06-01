import axiosClient from "@/services/backend/axiosClient";
import { Button, TextInput } from "@mantine/core";
import clsx from "clsx";

export default function Home() {
  return (
    <div>
      {/* In order for button to display properly, pls set backgroundColor. Thank you Tailwind... */}
      <Button className="bg-primary">Primary</Button>
      <Button className="bg-secondary" color="customSecondary">
        Secondary
      </Button>
      <Button className="gradient">Gradient</Button>
      <Button
        onClick={() => axiosClient.post("/auth/login", {})}
        className="gradient"
      >
        Login
      </Button>
      <TextInput
        label="Mantine is awesome"
        placeholder="Input"
        error="Meomeo"
        classNames={{
          input: "bg-primary",
          label: "color-primary text-xl",
          error: clsx("text-red-500 hover:text-2xl", true && "text-3xl"),
        }}
      />
    </div>
  );
}
