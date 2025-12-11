<?php

namespace App\Concerns;

use Spatie\Permission\Exceptions\RoleAlreadyExists;
use Spatie\Permission\Models\Role;

trait CreateRole
{
    public function createAdminRole(string $name): Role
    {
        $attributes = [];
        $attributes['name'] = $name;
        $attributes['guard_name'] = "admin";
        try {
            return Role::firstOrCreate($attributes);
        } catch (RoleAlreadyExists $e) {
            // Do nothing
        }
    }

    public function createWebRole(string $name): Role
    {
        $attributes = [];
        $attributes['name'] = $name;
        $attributes['guard_name'] = "web";
        try {
            return Role::firstOrCreate($attributes);
        } catch (RoleAlreadyExists $e) {
            // Do nothing
        }
    }
}
