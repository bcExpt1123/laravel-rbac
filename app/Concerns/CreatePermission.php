<?php

namespace App\Concerns;

use Spatie\Permission\Exceptions\PermissionAlreadyExists;
use Spatie\Permission\Models\Permission;

trait CreatePermission
{
    // We won't use admin guard
    // public function createAdminPermission(string $name): Permission
    // {
    //     $attributes = [];
    //     $attributes['name'] = $name;
    //     $attributes['guard_name'] = "admin";

    //     try {
    //         return Permission::firstOrCreate($attributes);
    //     } catch (PermissionAlreadyExists $e) {
    //         // Do nothing
    //     }
    // }
    
    public function createWebPermission(string $name): Permission
    {
        $attributes = [];
        $attributes['name'] = $name;
        $attributes['guard_name'] = "web";

        try {
            return Permission::firstOrCreate($attributes);
        } catch (PermissionAlreadyExists $e) {
            // Do nothing
        }
    }
}
