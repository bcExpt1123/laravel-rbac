import AppLayout from '@/layouts/app-layout';
import { create, index as list } from '@/routes/roles/index';
import { Permission, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { RoleForm } from './form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Role List',
    href: list().url,
  },
  {
    title: 'Create a Role',
    href: create().url,
  },
];

interface PageProps extends SharedData {
  permissions: Permission[];
}

export default function RoleCreation() {
  const { props } = usePage<PageProps>();
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create a Role" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <RoleForm btnLabel='Create' permissions={props.permissions} />
      </div>
    </AppLayout>
  );
}
