import AppLayout from '@/layouts/app-layout';
import { edit, index as list } from '@/routes/roles/index';
import { Permission, Role, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { RoleForm } from './form';

interface PageProps extends SharedData {
  role: Role;
  permissions: Permission[];
}

export default function RoleEdition() {
  const { props } = usePage<PageProps>();
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Role List',
      href: list().url,
    },
    {
      title: 'Edit a Role',
      href: edit(props.role.id).url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit a Role" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <RoleForm btnLabel='Save' initialValue={props.role} permissions={props.permissions} />
      </div>
    </AppLayout>
  );
}
