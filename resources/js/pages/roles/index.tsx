import AppLayout from '@/layouts/app-layout';
import { index as roleList } from '@/routes/roles/index';
import { PaginatedData, PaginatedFilter, Role, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { useAuthPage } from '@/hooks/use-auth-page';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Role List',
    href: roleList().url,
  },
];

interface PageProps extends SharedData {
  roles: PaginatedData<Role>;
  filters: PaginatedFilter;
}

export default function RoleList() {
  const { props, can } = useAuthPage<PageProps>();
  const { roles, filters } = props;

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Role List" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <DataTable
          data={roles}
          columns={columns}
          variant="striped"
          filter={filters}
          actions={
            <div>
              {
                can('add-role')
                  ? <TextLink href="/roles/create">
                    <Button>
                      Add a new Role
                    </Button>
                  </TextLink>
                  : <></>
              }

            </div>
          }
          renderRowActions={item => {
            return <TextLink href={`/roles/${item.id}`}>
              {
                can('edit-role')
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
