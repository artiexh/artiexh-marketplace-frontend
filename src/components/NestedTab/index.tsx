import { Collapse, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type NestedTabProps = {
  tabs: {
    key: string;
    element: JSX.Element;
    title: string;
  }[];
  parentTab: {
    key: string;
    element: JSX.Element;
    title: string;
  };
};

export default function NestedTab({ tabs, parentTab }: NestedTabProps) {
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <div className="nested-tab">
      <div onClick={toggle}>{parentTab.title}</div>
      <Collapse in={opened}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.key}
              value={tab.key}
              className="flex justify-center"
            >
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Collapse>
    </div>
  );
}
