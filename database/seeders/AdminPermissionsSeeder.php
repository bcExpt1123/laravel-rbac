<?php

namespace Database\Seeders;

use App\Concerns\CreatePermission;
use App\Concerns\CreateRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AdminPermissionsSeeder extends Seeder
{
    use CreatePermission, CreateRole;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view-role',
            'add-role',
            'edit-role',
            'delete-role',
            'view-user',
            'add-user',
            'edit-user',
            'edit-user-role',
            'delete-user',
        ];
        foreach ($permissions as $permission) {
            $this->createWebPermission($permission);
        }

        $role = $this->createWebRole("Super Admin");

        $permissions = Permission::where('guard_name', 'web')->pluck('id')->toArray();

        if (!empty($permissions)) {
            $role->syncPermissions($permissions);
        }
    }
}
