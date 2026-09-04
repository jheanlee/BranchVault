import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  getPasswordItems,
  type PasswordListItem,
} from "@/services/items/password.ts";
import { paths } from "@/config/paths.ts";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { Button } from "@/components/ui/button.tsx";

interface PasswordListProps {
  setItemId: (arg0: number | null) => void;
  updateTrigger: boolean;
  itemSearchString: string;
}

export const PasswordList = ({
  setItemId,
  updateTrigger,
  itemSearchString,
}: PasswordListProps) => {
  const navigate = useNavigate();

  const [items, setItems] = useState<PasswordListItem[] | undefined>(undefined);

  useEffect(() => {
    const getItems = async () => {
      const res = await getPasswordItems();
      if (typeof res === "number") {
        toast.error(() => {
          switch (res) {
            case 400:
              return "Invalid item";
            case 401:
              navigate(paths.root.login.getHref());
              return "Session expired";
            case 403:
              return "Access denied";
            case 500:
              return "Unable to connect to server";
            default:
              return `An error has occurred. Error code: ${res}`;
          }
        });
      } else {
        setItems(res);
      }
    };

    void (async () => await getItems())();
  }, [updateTrigger]);

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col mr-4">
        {items !== undefined &&
          items.map((item) => {
            return (
              (itemSearchString === "" ||
                item.name.includes(itemSearchString) ||
                item.website.some((website) =>
                  website.includes(itemSearchString),
                )) && (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full h-auto justify-start text-left g-2"
                  onClick={() => setItemId(item.id)}
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="text-gray-500">
                      {item.username.length !== 0 ? item.username : item.email}
                    </p>
                  </div>
                </Button>
              )
            );
          })}
        <ScrollBar orientation="vertical" />
      </div>
    </ScrollArea>
  );
};
