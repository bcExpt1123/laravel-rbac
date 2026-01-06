import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, useForm } from '@inertiajs/react';
import InputError from "@/components/input-error";
import { User } from "@/types";
import UserController from "@/actions/App/Http/Controllers/UserController"

interface UserFormProps {
  btnLabel: string;
  initialValue?: User;
}
export const UserForm = (props: UserFormProps) => {
  return <Form
    {...UserController.store.form()}
    options={{
      preserveScroll: true,
    }}
    resetOnSuccess
    className="space-y-6"
  >
    {({ processing, errors }) => (
      <div className='max-w-3xl space-y-4'>
        {/* User ID */}
        {
          props.initialValue
            ? <Input type='hidden' name='user_id' defaultValue={props.initialValue.id} />
            : <></>
        }
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={props.initialValue?.name} />
          <InputError message={errors.name} />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" defaultValue={props.initialValue?.email} />
          <InputError message={errors.email} />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">
            Password {props.initialValue && '(leave blank to keep current)'}
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
          />
          <InputError message={errors.password} />
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">
            Confirm Password
          </Label>
          <Input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
          />
        </div>

        {/* Submit */}
        <Button disabled={processing} type="submit">
          {props.btnLabel}
        </Button>
      </div>
    )}
  </Form>
}