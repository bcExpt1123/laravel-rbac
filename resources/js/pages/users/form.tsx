import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import InputError from "@/components/input-error";
import { Permission, Role, User } from "@/types";
import UserController from "@/actions/App/Http/Controllers/UserController"
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { slug2label } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface UserFormProps {
  btnLabel: string;
  initialValue?: User;
  roles: Role[];
  permissions: Permission[];
}
export const UserForm = (props: UserFormProps) => {
  const { can } = useAuth();
  const editable = can('edit-user') || can('add-user');
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
            ? <Input type='hidden' name='user_id' defaultValue={props.initialValue.id} disabled={!editable} />
            : <></>
        }
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={props.initialValue?.name} disabled={!editable} />
          <InputError message={errors.name} />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" defaultValue={props.initialValue?.email} disabled={!editable} />
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
            disabled={!editable}
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
            disabled={!editable}
          />
        </div>

        {/* Roles */}
        <div className='grid gap-2'>
          <Label>Roles</Label>
          <CheckboxGroup
            className='grid gap-2'
            name="roles"
            options={props.roles}
            valueKey="name"
            labelKey="name"
            renderLabel={label => {
              return slug2label(label)
            }}
            defaultValue={props.initialValue?.roles?.map(p => p.name)}
            disabled={!editable}
          />
          <InputError message={errors.roles} />
        </div>

        {/* Permissions */}
        <div className='grid gap-2'>
          <Label>Permissions</Label>
          <CheckboxGroup
            className='grid gap-2'
            name="permissions"
            options={props.permissions}
            valueKey="name"
            labelKey="name"
            renderLabel={label => {
              return slug2label(label)
            }}
            defaultValue={props.initialValue?.permissions?.map(p => p.name)}
            disabled={!editable}
          />
          <InputError message={errors.permissions} />
        </div>

        {/* Submit */}
        {
          editable
            ? <Button disabled={processing} type="submit">
              {props.btnLabel}
            </Button>
            : <></>
        }
      </div>
    )}
  </Form>
}