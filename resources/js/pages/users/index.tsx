import AppLayout from '@/layouts/app-layout';
import { index as list } from '@/routes/users/index';
import { PaginatedData, PaginatedFilter, SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { useAuthPage } from '@/hooks/use-auth-page';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User List',
    href: list().url,
  },
];

interface PageProps extends SharedData {
  users: PaginatedData<User>;
  filters: PaginatedFilter;
}

export default function UserList() {
  const { props, can } = useAuthPage<PageProps>();
  const { users, filters } = props;

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" }
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
          actions={
            <div>
              {
                can('add-user')
                  ? <TextLink href="/users/create">
                    <Button>
                      Add a new User
                    </Button>
                  </TextLink>
                  : <></>
              }
            </div>
          }
          renderRowActions={item => {
            return <TextLink href={`/users/${item.id}`}>
              {
                can('edit-user')
                  ? 'Edit'
                  : 'View'
              }
            </TextLink>
          }}
        />
      </div>
    </AppLayout>
  );
}
