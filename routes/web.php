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
        Route::get('/users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');

        Route::middleware(['permission:user-create'])->group(function () {
            // Route::get('/users/create', [\App\Http\Controllers\UserController::class, 'create'])->name('users.create');
            Route::post('/users', [\App\Http\Controllers\UserController::class, 'store'])->name('users.store');
        });

        Route::middleware(['permission:user-edit'])->group(function () {
            Route::get('/users/{user}/edit', [\App\Http\Controllers\UserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');
        });

        Route::middleware(['permission:user-delete'])->group(function () {
            Route::delete('/users/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('users.destroy');
        });
    });
});

require __DIR__.'/settings.php';
