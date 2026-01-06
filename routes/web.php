<?php

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
    
    Route::middleware(['permission:user-read'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])
            ->name('users.index');

        Route::get('/users/create', [UserController::class, 'create'])
            ->middleware('permission:user-create')
            ->name('users.create');

        Route::get('/users/{user}/edit', [UserController::class, 'edit'])
            ->middleware('permission:user-edit')
            ->name('users.edit');

        // ✅ ONE endpoint for create + update
        Route::post('/users/store', [UserController::class, 'store'])
            ->middleware(['permission:user-create|user-edit'])
            ->name('users.store');

        Route::delete('/users/{user}', [UserController::class, 'destroy'])
            ->middleware('permission:user-delete')
            ->name('users.destroy');
    });
});

require __DIR__.'/settings.php';
