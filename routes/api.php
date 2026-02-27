<?php

use Illuminate\Support\Facades\Route;

Route::domain(config('domain.api'))->group(function () {
    Route::middleware(['auth', 'verified'])->group(function () {

    });
    
});