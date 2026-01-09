# Role Based Access Control - Laravel Inertia React

Role Based Access Control (RBAC) starter for Laravel using Inertia + React (TypeScript).  
A simple, pragmatic foundation for building Laravel apps that need role & permission management with a modern SPA-style frontend.

- Repo: bcExpt1123/laravel-rbac
- Description: Role Based Access Control - Laravel Inertia React
- Languages: TypeScript, PHP (Laravel), CSS

---

## Table of contents

- Features
- Tech stack
- Requirements
- Quick start (local)
- Environment variables
- Database & seeds
- Frontend (Inertia + React)
- Typical workflows
- Example usage
- Testing
- Deployment
- Contributing
- License
- Contact

---

## Features

- Role-based access control (RBAC) for users
- Permission management (assign permissions to roles and users)
- Laravel backend with Inertia.js powering a React (TypeScript) frontend
- Ready-to-run migrations & seeders to bootstrap roles/permissions and an admin user
- Example UI for managing roles, permissions and users (React + TypeScript components)

---

## Tech stack

- Backend: Laravel (PHP)
- Frontend: React with TypeScript, Inertia.js
- Styling: CSS (or a utility framework if present)
- Database: MySQL / PostgreSQL / SQLite (configurable via .env)

---

## Requirements

- PHP 8.x (compatible version for your Laravel release)
- Composer
- Node.js 16+ and npm (or yarn/pnpm)
- A database supported by Laravel (MySQL, MariaDB, PostgreSQL, SQLite)
- Optional: Docker / Laravel Sail

---

## Quick start (local)

1. Clone the repo
   ```
   git clone https://github.com/bcExpt1123/laravel-rbac.git
   cd laravel-rbac
   ```

2. Install PHP dependencies
   ```
   composer install
   ```

3. Install frontend dependencies
   ```
   npm install
   # or
   # yarn
   # pnpm install
   ```

4. Copy .env and set values
   ```
   cp .env.example .env
   php artisan key:generate
   ```
   Edit `.env` to set database and other environment variables (see next section).

5. Run database migrations and seed initial data
   ```
   php artisan migrate --seed
   ```
   (If you have a seeder to create roles/permissions and an admin user.)

6. Development (two common steps you used)
   - Start Laravel SSR (if configured):
     ```
     composer run dev:ssr
     ```
   - Start the frontend dev server (Vite):
     ```
     npm run dev
     ```
   Run these in separate terminals (or in background). These are the commands you mentioned using during development.

7. Serve the app (if not using SSR command to run the dev server)
   ```
   php artisan serve
   # Visit http://127.0.0.1:8000
   ```

---

## Environment variables

Typical variables needed in `.env`:

- APP_NAME, APP_ENV, APP_URL
- DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- MAIL_*, BROADCAST_DRIVER, CACHE_DRIVER, QUEUE_CONNECTION, SESSION_DRIVER (as needed)
- FRONTEND_URL (if separating frontend origin)
- Any OAuth or third-party credentials your app requires

Include `.env.example` in the repo with non-sensitive defaults.

---

## Database & seeds

- Run migrations:
  ```
  php artisan migrate
  ```

- Seeders:
  - A Roles/Permissions seeder should create common roles (e.g., admin, user) and seed example permissions.
  - An Admin user seeder should create at least one user and assign the admin role.

Common artisan commands:
```
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=AdminUserSeeder
```

If you need to start fresh:
```
php artisan migrate:fresh --seed
```

Creating an admin via tinker:
```
php artisan tinker
>>> $user = \App\Models\User::factory()->create(['email' => 'admin@example.com']);
>>> $user->assignRole('admin'); // or assign permissions directly
```

---

## Frontend (Inertia + React + TypeScript)

- The frontend uses Inertia to render React pages served by Laravel.
- Development:
  - Start SSR (if your setup uses server-side rendering)
    ```
    composer run dev:ssr
    ```
  - Start Vite dev server (hot module replacement)
    ```
    npm run dev
    ```
  Run both while developing (two terminals) so Laravel serves SSR endpoints while Vite serves/compiles assets.

- Production:
  ```
  npm run build
  ```
  Then serve the compiled assets (Laravel will typically use the built files).

- TypeScript:
  - Keep types for API responses and models in sync where possible.
  - Use Inertia form helpers or your preferred form handling library to integrate with Laravel endpoints.

---

## Typical workflows

- Protect routes using middleware:
  - Example middleware usage (conceptual):
    - role middleware: `->middleware('role:admin')`
    - permission middleware: `->middleware('permission:edit-user')`
  - Or use Gates/Policies for resource-level access control.

- Assign roles & permissions:
  - Through admin UI or via seeder/tinker:
    - `assignRole('editor')`
    - `givePermissionTo('edit-user')`
    - `$user->syncRoles($roles);`
    - `$user->syncPermissions($permissions);`
    - `$role->syncPermissions($permissions);`

- Check permissions in code:
  - `auth()->user()->hasRole('admin')`
  - `auth()->user()->can('edit-role')`

- Check permissions in controller:
    ```php
    class UserController extends Controller
    {
        public function index(Request $request)
        {
            $this->authorize('view-user');
            ...
    ```

- Check permissions in Blade/React:
  - Blade: `@can('edit-user') ... @endcan`
  - React: 
    ```tsx
    const { can } = useAuth();
    can('edit-user') && <EditUserComponent />
    ```
    or
    ```tsx
    const { props, can } = useAuthPage<PageProps>();
    {can('edit-user') && <EditUserComponent />}
    ```

---

## Example usage (routes & controller)

Example protected route in `routes/web.php`:
```php
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware(['auth', 'role:admin']);

Route::get('/users/create', [UserController::class, 'create'])
    ->middleware('permission:add-user')
    ->name('users.create');
```

Example React page (Inertia):
```tsx
import AppLayout from '@/layouts/app-layout';
import { index as roleList } from '@/routes/roles/index';
import { PaginatedData, PaginatedFilter, Role, SharedData, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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
                // Check permission to show "Add Role" button
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
                // Check permission to show "Edit" or "View" based on access
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

```

---

## Testing

- Backend tests (PHPUnit)
  ```
  php artisan test
  ```

Make sure tests set up database transactions or use the testing database.

---

## Deployment

- Build frontend assets for production:
  ```
  npm run build
  ```
- Configure environment variables on your server or platform (Forge, Vapor, Heroku, etc.).
- Run migrations on deploy:
  ```
  php artisan migrate --force
  ```
- Clear caches as part of deploy:
  ```
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  ```

If you use Docker / Sail, build/push images and run migrations inside the container.

---

## Contributing

- Fork the repo and open a PR
- Run tests and ensure code style is consistent
- Document any breaking changes or migrations in the PR description
- Suggestions: add new seeders, additional middleware, more granular permissions, and improved UI components

---

## Troubleshooting

- Common issues:
  - Missing APP_KEY: run `php artisan key:generate`
  - Asset problems: run `npm install` and `npm run dev` (or `npm run build`)
  - If using SSR: ensure `composer run dev:ssr` is running when testing SSR pages
  - Migration errors: verify DB credentials and run `php artisan migrate:status`

- Useful artisan commands:
  - `php artisan route:list`
  - `php artisan config:clear`
  - `php artisan cache:clear`
  - `php artisan storage:link`

---

## Roadmap / Ideas

- Add permissions UI to manage fine-grained permissions
- Add audit logs for role/permission changes
- Add tests covering RBAC behavior (policies/gates)
- Add Docker Compose or example production deployment manifests

---

## License

Include your chosen license (e.g., MIT). Example:
```
MIT License
```
(Replace with license file contents and add LICENSE file in repo.)

---

## Contact

Repository owner: bcExpt1123