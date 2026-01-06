<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\Users\UserStoreRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{
    use AuthorizesRequests;

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

        return Inertia::render('users/create');
    }
    
    public function edit(User $user)
    {
        $this->authorize('edit-user');

        return Inertia::render('users/edit', [
            'user' => $user,
        ]);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete-user');

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
