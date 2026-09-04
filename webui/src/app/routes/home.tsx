import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { PasswordForm } from "@/components/forms/password-item.tsx";
import { PasswordList } from "@/components/list/password-list.tsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";

export const Home = () => {
  const [itemId, setItemId] = useState<number | null>(null);
  const [itemListUpdateTrigger, setItemListUpdateTrigger] =
    useState<boolean>(false);
  const [itemSearchString, setItemSearchString] = useState<string>("");

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden p-4">
      <div className="w-full flex flex-row justify-between pl-2 pr-4 my-2">
        <Input
          className="w-100"
          placeholder="Search"
          value={itemSearchString}
          onInput={(event) => {
            setItemSearchString(event.currentTarget.value);
          }}
        />
        <Button onClick={() => setItemId(null)}>
          <Plus />
          Create
        </Button>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full overflow-hidden"
      >
        <ResizablePanel>
          <PasswordList
            setItemId={setItemId}
            updateTrigger={itemListUpdateTrigger}
            itemSearchString={itemSearchString}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <PasswordForm
            id={itemId}
            setId={setItemId}
            updateTrigger={itemListUpdateTrigger}
            setUpdateTrigger={setItemListUpdateTrigger}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
