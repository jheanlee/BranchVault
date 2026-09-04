import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { CopyCheck, Copy, PlusIcon, EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { passwordSchema } from "@/services/form-schemas/password-item.ts";
import {
  deletePasswordItem,
  getPasswordItem,
  newPasswordItem,
  updatePasswordItem,
} from "@/services/items/password.ts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

interface PasswordItemProps {
  id: number | null;
  setId: (arg0: number | null) => void;
  updateTrigger: boolean;
  setUpdateTrigger: (arg0: boolean) => void;
}

export const PasswordForm = ({
  id,
  setId,
  updateTrigger,
  setUpdateTrigger,
}: PasswordItemProps) => {
  const [decryptingState, setDecryptingState] = useState<boolean>(false);
  const [usernameCopied, setUsernameCopied] = useState<boolean>(false);
  const [passwordCopied, setPasswordCopied] = useState<boolean>(false);
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
  const [processState, setProcessState] = useState<boolean>(false);
  const [decryptionError, setDecryptionError] = useState<string | undefined>(
    undefined,
  );

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      websites: [""],
      notes: "",
    },
  });

  useEffect(() => {
    setUsernameCopied(false);
    setPasswordCopied(false);
    setPasswordHidden(true);
    setProcessState(false);
    setDecryptionError(undefined);
    if (id !== null) {
      setDecryptingState(true);
      const fetchPassword = async () => {
        const res = await getPasswordItem(id);
        if (typeof res !== "number") {
          form.reset(res);
        } else {
          const errorMessage = (() => {
            switch (res) {
              case 400:
                return "Invalid item";
              case 401:
                return "Session expired";
              case 403:
                return "Access denied";
              case 404:
                return "This item does not exist";
              case 500:
                return "Unable to connect to server";
              case 1403:
                return "Failed to decrypt item: invalid key or corrupted item";
              default:
                return `An error has occurred. Error code: ${res}`;
            }
          })();

          setDecryptionError(errorMessage);
          toast.error(errorMessage);
        }
        setDecryptingState(false);
      };

      void (async () => await fetchPassword())();
    } else {
      setDecryptingState(false);
      form.reset({
        name: "",
        email: "",
        username: "",
        password: "",
        websites: [""],
        notes: "",
      });
    }
  }, [id]);

  useEffect(() => {
    if (usernameCopied) {
      const timer = setTimeout(() => {
        setUsernameCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [usernameCopied]);
  useEffect(() => {
    if (passwordCopied) {
      const timer = setTimeout(() => {
        setPasswordCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [passwordCopied]);

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setProcessState(true);
    if (id === null) {
      const res = await newPasswordItem(values);
      if (res === 200) {
        toast.success("Password item created");
      } else {
        toast.error(() => {
          switch (res) {
            case 400:
              return "Invalid item";
            case 401:
              return "Session expired";
            case 403:
              return "Access denied";
            case 500:
              return "Unable to connect to the server";
            default:
              return `An error has occurred. Error code: ${res}`;
          }
        });
      }
      form.reset({
        name: "",
        email: "",
        username: "",
        password: "",
        websites: [""],
        notes: "",
      });
    } else {
      const res = await updatePasswordItem(values, id);
      if (res === 200) {
        toast.success("Password item updated");
      } else {
        toast.error(() => {
          switch (res) {
            case 400:
              return "Invalid item";
            case 401:
              return "Session expired";
            case 403:
              return "Access denied";
            case 404:
              return "This item does not exist";
            case 500:
              return "Unable to connect to the server";
            default:
              return `An error has occurred. Error code: ${res}`;
          }
        });
      }
    }
    setProcessState(false);
    setUpdateTrigger(!updateTrigger);
  };

  const deleteItem = async (id: number) => {
    const res = await deletePasswordItem(id);
    if (res == 200) {
      toast.success("Password item deleted");
    } else {
      toast.error(() => {
        switch (res) {
          case 401:
            return "Session expired";
          case 403:
            return "Access denied";
          case 404:
            return "This item does not exist";
          case 500:
            return "Unable to connect to the server";
          default:
            return `An error has occurred. Error code: ${res}`;
        }
      });
    }
    setId(null);
    setUpdateTrigger(!updateTrigger);
  };

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col m-4 mb-10">
        <p className="text-lg font-semibold mb-4">
          {id === null ? "New Password Item" : "View / Modify Password Item"}
        </p>
        {decryptingState && <p>Decrypting...</p>}
        {decryptionError && <p>{decryptionError}</p>}
        {!decryptingState && decryptionError === undefined && (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Item Name</FieldLabel>
                      <FieldContent>
                        <Input
                          type="text"
                          placeholder="Item Name"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <FieldContent>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Username</FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            type="text"
                            placeholder="Username"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              aria-label="copy"
                              title="copy"
                              size="icon-xs"
                              onClick={async () => {
                                void navigator.clipboard.writeText(
                                  form.getValues("username"),
                                );
                                setUsernameCopied(true);
                              }}
                            >
                              {usernameCopied ? <CopyCheck /> : <Copy />}
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            type={passwordHidden ? "password" : "text"}
                            placeholder="••••••••"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              aria-label="show-password"
                              title="show-password"
                              size="icon-xs"
                              onClick={async () => {
                                setPasswordHidden(!passwordHidden);
                              }}
                            >
                              {passwordHidden ? <EyeOff /> : <Eye />}
                            </InputGroupButton>
                          </InputGroupAddon>
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              aria-label="copy"
                              title="copy"
                              size="icon-xs"
                              onClick={async () => {
                                void navigator.clipboard.writeText(
                                  form.getValues("password"),
                                );
                                setPasswordCopied(true);
                              }}
                            >
                              {passwordCopied ? <CopyCheck /> : <Copy />}
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="websites"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Website(s)</FieldLabel>
                      <FieldContent>
                        <div className="flex flex-col gap-1">
                          {field.value.map((item, index) => (
                            <Input
                              key={index}
                              type="text"
                              placeholder="example.com"
                              value={item}
                              aria-invalid={fieldState.invalid}
                              onInput={(event) => {
                                const websites = form.getValues("websites");
                                websites[index] = event.currentTarget.value;
                                form.setValue("websites", websites);
                              }}
                            />
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const websites = form.getValues("websites");
                              websites.push("");
                              form.setValue("websites", websites);
                            }}
                          >
                            <PlusIcon />
                          </Button>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="notes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Notes</FieldLabel>
                      <FieldContent>
                        <Textarea
                          placeholder="Notes"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                {id !== null && (
                  <Field>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        void (async () => await deleteItem(id))();
                      }}
                    >
                      Delete Item
                    </Button>
                  </Field>
                )}
                <Field>
                  <Button type="submit" disabled={processState}>
                    {processState && <Spinner />}
                    {processState
                      ? "Processing"
                      : id === null
                        ? "Create"
                        : "Update"}
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        )}
      </div>
    </ScrollArea>
  );
};
