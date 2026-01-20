<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::middleware(['permission:view-user'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])
            ->name('users.index');

        Route::get('/users/create', [UserController::class, 'create'])
            ->middleware('permission:add-user')
            ->name('users.create');

        Route::get('/users/{user}', [UserController::class, 'edit'])
            // ->middleware('permission:edit-user')
            ->name('users.edit');

        Route::post('/users/store', [UserController::class, 'store'])
            ->middleware(['permission:add-user|edit-user'])
            ->name('users.store');

        Route::delete('/users/{user}', [UserController::class, 'destroy'])
            ->middleware('permission:delete-user')
            ->name('users.destroy');
    });

    Route::middleware(['permission:view-role'])->group(function () {
        Route::get('/roles', [RoleController::class, 'index'])
            ->name('roles.index');

        Route::get('/roles/create', [RoleController::class, 'create'])
            ->middleware('permission:add-role')
            ->name('roles.create');

        Route::get('/roles/{role}', [RoleController::class, 'edit'])
            // ->middleware('permission:edit-role')
            ->name('roles.edit');

        Route::post('/roles/store', [RoleController::class, 'store'])
            ->middleware(['permission:add-role|edit-role'])
            ->name('roles.store');

        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])
            ->middleware('permission:delete-role')
            ->name('roles.destroy');
    });

    Route::middleware(['permission:view-audit-log'])->group(function () {
        Route::get('/audit-log', [AuditLogController::class, 'index'])
            ->name('audit-log.index');

        Route::get('/audit-log/{auditLog}', [AuditLogController::class, 'show'])
            ->name('audit-log.show');
    });
});

require __DIR__.'/settings.php';
