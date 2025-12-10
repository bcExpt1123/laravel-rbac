<?php

namespace Database\Seeders;

use App\Concerns\CreatePermission;
use Illuminate\Database\Seeder;

class PermissionsForPermissionsSeeder extends Seeder
{
    use CreatePermission;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->createAdminPermission("view permissions");
    }
}
