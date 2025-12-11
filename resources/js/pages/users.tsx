import AppLayout from '@/layouts/app-layout';
import { index as userList } from '@/routes/users/index';
import { PaginatedData, SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User List',
    href: userList().url,
  },
];

// const sampleUsers = [
//   { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
//   { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
//   { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User' },
//   { id: 4, name: 'Diana', email: 'diana@example.com', role: 'Moderator' },
//   { id: 5, name: 'Eve', email: 'eve@example.com', role: 'Admin' },
//   { id: 6, name: 'Frank', email: 'frank@example.com', role: 'User' },
//   { id: 7, name: 'Grace', email: 'grace@example.com', role: 'User' },
//   { id: 8, name: 'Hank', email: 'hank@example.com', role: 'User' },
//   { id: 9, name: 'Ivy', email: 'ivy@example.com', role: 'User' },
//   { id: 10, name: 'Jack', email: 'jack@example.com', role: 'User' },
//   { id: 11, name: 'Kate', email: 'kate@example.com', role: 'User' },
// ];

// const columns: { key: keyof typeof sampleUsers[0]; header: string }[] = [
//   { key: 'id', header: 'ID' },
//   { key: 'name', header: 'Name' },
//   { key: 'email', header: 'Email' },
//   { key: 'role', header: 'Role' },
// ];

interface PageProps extends SharedData {
  users: PaginatedData<User>;
  filters: any;
}

export default function UserList() {
  const { props } = usePage<PageProps>();
  console.log(props)
  const { users, filters } = props;

  // const [search, setSearch] = useState(filters.search ?? "");
  // const [perPage, setPerPage] = useState(filters.perPage ?? 10);

  // function updateFilters() {
  //   router.get(
  //     userList().url,
  //     { search, perPage },
  //     { replace: true, preserveState: true }
  //   );
  // }

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" }
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
        />
      </div>
    </AppLayout>
  );
}
