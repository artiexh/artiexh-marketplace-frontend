import { Drawer, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function SortButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const items = ["Tất cả", "Mới nhất", "Cũ nhất"];
  return (
    <>
      <Drawer opened={opened} onClose={close} position="bottom">
        <div className="mb-2">
          {items.map((item) => (
            <div key={item} className="ml-2 py-1">
              {item}
            </div>
          ))}
        </div>
      </Drawer>
      <Button
        onClick={open}
        className="bg-white border-1 border-black !text-black rounded-sm"
      >
        Sort
      </Button>
    </>
  );
}
