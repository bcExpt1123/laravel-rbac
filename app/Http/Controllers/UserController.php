<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\Users\UserStoreRequest;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $this->authorize('view-user');

        $users = User::query();

        if ($search = $request->input('search')) {
            $users->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('perPage', 10);
        $users = $users->paginate($perPage)->appends($request->except('page'));

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        $isUpdate = $request->filled('user_id');

        // ✅ Permission check
        if ($isUpdate) {
            $this->authorize('edit-user');
        } else {
            $this->authorize('add-user');
        }

        $user = $isUpdate
            ? User::findOrFail($request->user_id)
            : new User();

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }

        $user->save();

        $roles = Role::whereIn('name', $request->roles ?? [])->pluck('id')->toArray();
        $user->syncRoles($roles);
        $permissions = Permission::whereIn('name', $request->permissions ?? [])->pluck('id')->toArray();
        $user->syncPermissions($permissions);

        return redirect()
            ->route('users.index')
            ->with(
                'success',
                $isUpdate
                    ? 'User updated successfully.'
                    : 'User created successfully.'
            );
    }

    public function create()
    {
        $this->authorize('add-user');

        $roles = Role::all();
        $permissions = Permission::all();

        return Inertia::render('users/create', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function edit(User $user)
    {
        // $this->authorize('edit-user');

        $user->load('roles');
        $user->load('permissions');

        $roles = Role::all();
        $permissions = Permission::all();

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete-user');

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
