<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::domain(config('domain.app'))->middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
});