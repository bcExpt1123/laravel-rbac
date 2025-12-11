<?php

namespace Database\Seeders;

use App\Concerns\CreateRole;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Permission;

class AdminSeeder extends Seeder
{
    use CreateRole;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User', 
                'password' => bcrypt('123456')
            ]
        );
    
        $role = $this->createWebRole("Super Admin");
     
        $permissions = Permission::where('guard_name', 'web')->pluck('id')->toArray();

        if (!empty($permissions)) {
            $role->syncPermissions($permissions);
        }

        $user->assignRole([$role->id]);
    }
}
