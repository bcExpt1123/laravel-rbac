import AppLayout from '@/layouts/app-layout';
import { index as auditList } from '@/routes/audit-log/index';
import { AuditLog, PaginatedData, PaginatedFilter, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import TextLink from '@/components/text-link';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Audit Logs',
    href: auditList().url,
  },
];

interface PageProps extends SharedData {
  logs: PaginatedData<AuditLog<unknown>>;
  filters: PaginatedFilter;
}

export default function AuditLogList() {
  const { props } = usePage<PageProps>();
  const { logs, filters } = props;

  const columns = [
    { key: "id", header: "ID" },
    { key: "created_at", header: "Date", render: (i: AuditLog<unknown>) => `${i.created_at}`.substring(0, 19).replace('T', ' ') },
    { key: "user", header: "User", render: (i: AuditLog<unknown>) => `${i.user.name ?? 'System'}` },
    { key: "event", header: "Event" },
    { key: "target", header: "Target", render: (i: AuditLog<unknown>) => `${i.auditable_type} #${i.auditable_id}` },
    { key: "ip_address", header: "IP" },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Audit Logs" />
      {/* TODO Add Filter */}
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <DataTable
          data={logs}
          hideSearch
          columns={columns}
          variant="striped"
          filter={filters}
          renderRowActions={item => {
            return <TextLink href={`/audit-log/${item.id}`}>View</TextLink>
          }}
        />
      </div>
    </AppLayout>
  );
}
