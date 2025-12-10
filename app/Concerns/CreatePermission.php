<?php

namespace App\Concerns;

use Spatie\Permission\Exceptions\PermissionAlreadyExists;
use Spatie\Permission\Models\Permission;

trait CreatePermission
{
    public function createAdminPermission(string $name): void
    {
        $attributes = [];
        $attributes['name'] = $name;
        $attributes['guard_name'] = "admin";

        try {
            Permission::create($attributes);
        } catch (PermissionAlreadyExists $e) {
            // Do nothing
        }
    }
}
