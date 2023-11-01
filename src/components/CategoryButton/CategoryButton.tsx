import { Drawer, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function CategoryButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const items = ["Tất cả", "T-Shirt", "Tote bag"];
  return (
    <>
      <Drawer opened={opened} onClose={close} position="bottom">
        {items.map((item) => (
          <div key={item} className="ml-4 py-1">
            {item}
          </div>
        ))}
      </Drawer>
      <Button
        onClick={open}
        className="bg-white border-1 border-black !text-black rounded-sm flex-1"
      >
        Danh mục
      </Button>
    </>
  );
}
