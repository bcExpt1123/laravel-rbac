import AppLayout from '@/layouts/app-layout';
import { edit, index as userList } from '@/routes/users/index';
import { SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { UserForm } from './form';

interface PageProps extends SharedData {
  user: User;
}

export default function UserEdition() {
  const { props } = usePage<PageProps>();
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'User List',
      href: userList().url,
    },
    {
      title: 'Edit an User',
      href: edit(props.user.id).url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User List" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <UserForm btnLabel='Save' initialValue={props.user} />
      </div>
    </AppLayout>
  );
}
