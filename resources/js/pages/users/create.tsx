import AppLayout from '@/layouts/app-layout';
import { create, index as list } from '@/routes/users/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { UserForm } from './form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User List',
    href: list().url,
  },
  {
    title: 'Create an User',
    href: create().url,
  },
];

export default function UserCreation() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create an User" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <UserForm btnLabel='Create' />
      </div>
    </AppLayout>
  );
}
