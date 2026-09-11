/*
 * Copyright 2026 Jhe-An Lee
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
