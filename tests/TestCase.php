<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Artisan;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function runTestMigrations(): void
    {
        
        Artisan::call('migrate:fresh', [
            '--path' => 'tests/database/migrations',
            '--database' => 'sqlite',
            '--realpath' => true,
        ]);

        // Optional: seed test data
        // Artisan::call('db:seed', [
        //     '--class' => 'Tests\\Database\\Seeders\\TestSeeder',
        // ]);
    }
}
