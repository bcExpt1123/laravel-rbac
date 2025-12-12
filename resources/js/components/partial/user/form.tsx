import { RouteFormDefinition } from "@/wayfinder"
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import InputError from "@/components/input-error";
import { User } from "@/types";

interface UserFormProps {
  formController: RouteFormDefinition<"post">;
  btnLabel: string;
  initialValue?: User;
}
export const UserForm = (props: UserFormProps) => {
  return <Form
    {...props.formController}
    options={{
      preserveScroll: true,
    }}
    resetOnSuccess
    className="space-y-6"
  >
    {({ resetAndClearErrors, processing, errors }) => (
      <>
        <div className="grid gap-2">
          <Label
            htmlFor="password"
            className="sr-only"
          >
            Password
          </Label>

          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
          />

          <InputError message={errors.password} />
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              variant="secondary"
              onClick={() =>
                resetAndClearErrors()
              }
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            disabled={processing}
            asChild
          >
            <button
              type="submit"
              data-test="ok-user-button"
            >
              {props.btnLabel}
            </button>
          </Button>
        </DialogFooter>
      </>
    )}
  </Form>
}