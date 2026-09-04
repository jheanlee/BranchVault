import { signupSchema } from "@/services/form-schemas/signup.ts";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { isUsernameAvailable, signup } from "@/services/auth.ts";
import { generateKey } from "@/lib/key.ts";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { NavLink } from "react-router";
import { paths } from "@/config/paths.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

export const SignupForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [key, setKey] = useState<string | undefined>(undefined);
  const [keyCopied, setKeyCopied] = useState<boolean>(false);

  useEffect(() => {
    if (keyCopied) {
      const timer = setTimeout(() => {
        setKeyCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [keyCopied]);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    const res = await signup({
      username: values.username,
      password: values.password,
    });

    switch (res) {
      case 200: {
        setErrorMessage(undefined);
        const newKey = generateKey();
        setKey(newKey);
        break;
      }
      case 409: {
        setErrorMessage("Username unavailable");
        break;
      }
      case 500: {
        setErrorMessage("Unable to connect to the server");
        break;
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center content-center">
      {key === undefined && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-100 h-70 mt-20 flex flex-col gap-4 content-center"
        >
          <FieldSet data-invalid={errorMessage !== undefined}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Username</FieldLabel>
                    <Input
                      type="text"
                      placeholder="user"
                      onInput={async (event) => {
                        if (
                          !(await isUsernameAvailable({
                            username: event.currentTarget.value,
                          }))
                        ) {
                          form.setError("username", {
                            message: "Username unavailable",
                          });
                        } else {
                          form.clearErrors("username");
                        }
                      }}
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {errorMessage && <FieldError>{errorMessage}</FieldError>}
              <Field>
                <Button type="submit">Submit</Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      )}
      {key && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Master Key</DialogTitle>
              <DialogDescription>
                This key will be used to decrypt your items. Write it down and
                store it somewhere safe now as you will not be able to see it
                again.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full items-center">
              <Tooltip open={keyCopied}>
                <TooltipTrigger asChild>
                  <Input
                    defaultValue={key}
                    onClick={async () => {
                      void navigator.clipboard.writeText(key);
                      setKeyCopied(true);
                    }}
                    readOnly
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copied</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <DialogFooter>
              <Button asChild>
                <NavLink to={paths.root.login.getHref()}>Go to login</NavLink>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
