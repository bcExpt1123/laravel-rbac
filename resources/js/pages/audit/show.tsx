import AppLayout from '@/layouts/app-layout';
import { index as auditList, show } from '@/routes/audit-log/index';
import { AuditLog, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface PageProps extends SharedData {
  log: AuditLog<unknown>;
}

export default function AuditLogList() {
  const { props } = usePage<PageProps>();
  const { log } = props;
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Audit Logs',
      href: auditList().url,
    },
    {
      title: `#${log.id}`,
      href: show(log.id).url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Audit Log #${log.id}`} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p><strong>User:</strong> {log.user?.name ?? 'System'}</p>
            <p><strong>Event:</strong> {log.event}</p>
            <p><strong>Target:</strong> {`${log.auditable_type} #${log.auditable_id}`}</p>
            <p><strong>Date:</strong> {`${log.created_at}`.substring(0, 19).replace('T', ' ')}</p>
          </div>

          <div>
            <p><strong>IP:</strong> {log.ip_address}</p>
            <p><strong>URL:</strong> {log.url}</p>
            <p><strong>User Agent:</strong> {log.user_agent}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Old Values</h3>
            <pre className="text-muted-foreground dark:text-foreground bg-muted dark:bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(log.old_values, null, 2)}</pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">New Values</h3>
            <pre className="text-muted-foreground dark:text-foreground bg-muted dark:bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(log.new_values, null, 2)}</pre>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
