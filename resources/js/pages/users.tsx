import AppLayout from '@/layouts/app-layout';
import { index as userList } from '@/routes/users/index';
import { PaginatedData, PaginatedFilter, SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
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
  filters: PaginatedFilter;
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
