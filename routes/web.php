<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

require __DIR__.'/admin.php';
require __DIR__.'/account.php';
require __DIR__.'/app.php';
require __DIR__.'/api.php';
