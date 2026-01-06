<?php

namespace App\Http\Controllers;

use App\Http\Requests\Roles\RoleStoreRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('view-role');

        $roles = Role::query();

        if ($search = $request->input('search')) {
            $roles->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('perPage', 10);
        $roles = $roles->paginate($perPage)->appends($request->except('page'));

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }

    public function store(RoleStoreRequest $request)
    {
        $isUpdate = $request->filled('role_id');

        if ($isUpdate) {
            $this->authorize('edit-role');
        } else {
            $this->authorize('add-role');
        }

        $role = $isUpdate
            ? Role::findOrFail($request->role_id)
            : new Role();

        $role->name = $request->name;

        $role->save();
        $permissions = Permission::whereIn('name', $request->permissions)->pluck('id')->toArray();

        $role->syncPermissions($permissions);

        return redirect()
            ->route('roles.index')
            ->with(
                'success',
                $isUpdate
                    ? 'Role updated successfully.'
                    : 'Role created successfully.'
            );
    }

    public function create()
    {
        $this->authorize('add-role');

        $permissions = Permission::all();

        return Inertia::render('roles/create', [
            'permissions' => $permissions
        ]);
    }

    public function edit(Role $role)
    {
        $this->authorize('edit-role');

        $permissions = Permission::all();
        $role->load('permissions');

        return Inertia::render('roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    public function destroy(Role $role)
    {
        $this->authorize('delete-role');

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
