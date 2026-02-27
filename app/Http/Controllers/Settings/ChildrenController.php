<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class ChildrenController extends Controller
{
    public function index(Request $request): Response
    {
        $children = $request->user()
            ->children()
            ->select([
                'users.id as id',
                'users.name as name',
            ])
            ->get();
        return Inertia::render('settings/children', [
            'children' => $children
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $parent = $request->user();

        $duplicateNameExists = $parent->children()
            ->where('users.name', $validated['name'])
            ->exists();

        if ($duplicateNameExists) {
            return back()->withErrors([
                'name' => 'A child with this name already exists.',
            ]);
        }

        DB::transaction(function () use ($validated, $parent) {

            // Generate a temporary unique email
            do {
                $temporaryEmail = 'child_' . Str::uuid() . '@bdsa-temporary-email.com';
            } while (User::where('email', $temporaryEmail)->exists());

            // Create child user
            $child = User::create([
                'name'     => $validated['name'],
                'email'    => $temporaryEmail,
                'password' => bcrypt(Str::random(32)),
            ]);

            // Assign child permission
            $permissions = Permission::whereIn('name', ['is-child'])->pluck('id')->toArray();
            $child->syncPermissions($permissions);

            // Attach to parent
            $parent->children()->attach($child->id);
        });

        return back()->with('success', 'Child account created successfully.');
    }


    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'child_id' => ['required', 'exists:users,id'],
            'name'     => ['required', 'string', 'max:255'],
        ]);

        $parent = $request->user();

        // Ensure this child belongs to the parent
        if (! $parent->children()->where('child_id', $validated['child_id'])->exists()) {
            abort(403);
        }

        $duplicateNameExists = $parent->children()
            ->where('users.name', $validated['name'])
            ->where('users.id', '!=', $validated['child_id'])
            ->exists();

        if ($duplicateNameExists) {
            return back()->withErrors([
                'name' => 'A child with this name already exists.',
            ]);
        }

        $child = User::findOrFail($validated['child_id']);

        $child->update([
            'name'  => $validated['name'],
        ]);

        return back()->with('success', 'Child updated successfully.');
    }


    public function remove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'child_id' => ['required', 'exists:users,id'],
        ]);

        $parent = $request->user();

        $relation = $parent->children()
            ->where('child_id', $validated['child_id'])
            ->first();

        if (! $relation) {
            abort(403);
        }

        DB::transaction(function () use ($parent, $validated) {
            $parent->children()
                ->updateExistingPivot($validated['child_id'], [
                    'deleted_at' => now(),
                ]);
        });

        return back()->with('success', 'Child removed successfully.');
    }
}
