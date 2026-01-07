import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import InputError from "@/components/input-error";
import { Permission, Role } from "@/types";
import RoleController from "@/actions/App/Http/Controllers/RoleController"
import { slug2label } from '@/lib/utils';
import { CheckboxGroup } from '@/components/ui/checkbox-group';

interface RoleFormProps {
  btnLabel: string;
  initialValue?: Role;
  permissions: Permission[];
}
export const RoleForm = (props: RoleFormProps) => {
  console.log(props)
  return <Form
    {...RoleController.store.form()}
    options={{
      preserveScroll: true,
    }}
    resetOnSuccess
    className="space-y-6"
  >
    {({ processing, errors }) => (
      <div className='max-w-3xl space-y-4'>
        {/* Role ID */}
        {
          props.initialValue
            ? <Input type='hidden' name='role_id' defaultValue={props.initialValue.id} />
            : <></>
        }
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={props.initialValue?.name} />
          <InputError message={errors.name} />
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
          />
          <InputError message={errors.permissions} />
        </div>

        {/* Users */}
        <div className='grid gap-2'>
          <Label>Users</Label>
          <ul>
            {
              props.initialValue?.users?.map(u => {
                return <li className='flex space-2'>- {u.email}</li>
              })
            }
            </ul>
        </div>

        {/* Submit */}
        <Button disabled={processing} type="submit">
          {props.btnLabel}
        </Button>
      </div>
    )}
  </Form>
}