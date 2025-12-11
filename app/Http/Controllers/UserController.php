<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('user-read');

        $users = User::query();

        if ($search = $request->input('search')) {
            $users->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('perPage', 10);
        $users = $users->paginate($perPage)->appends($request->except('page'));

        return Inertia::render('users', [
            'users' => $users,
            'filters' => $request->only(['search', 'perPage']),
            // 'permissions' => [
            //     'create' => $request->user()->can('user-create'),
            //     'edit' => $request->user()->can('user-edit'),
            //     'delete' => $request->user()->can('user-delete'),
            // ],
        ]);
    }

    public function create()
    {
        $this->authorize('user-create');

        return Inertia::render('user-create');
    }

    public function store(Request $request)
    {
        $this->authorize('user-create');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $this->authorize('user-edit');

        return Inertia::render('user-edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('user-edit');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }
        $user->save();

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->authorize('user-delete');

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
