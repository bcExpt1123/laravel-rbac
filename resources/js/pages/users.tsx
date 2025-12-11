import AppLayout from '@/layouts/app-layout';
import { index as userList } from '@/routes/users/index';
import { PaginatedData, SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { UserDialog } from '@/components/partial/user/dialog';
import { CreateUser } from '@/components/partial/user/create';
import { EditUser } from '@/components/partial/user/edit';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User List',
    href: userList().url,
  },
];

interface PageProps extends SharedData {
  users: PaginatedData<User>;
  filters: any;
}

export default function UserList() {
  const { props } = usePage<PageProps>();
  const { users, filters } = props;

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "actions", header: "Actions" }
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User List" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <DataTable
          data={users}
          columns={columns}
          variant="striped"
          filter={filters}
          actions={<CreateUser/>}
          renderRowActions={item => {
            return <EditUser user={item}/>
          }}
        />
      </div>
    </AppLayout>
  );
}
