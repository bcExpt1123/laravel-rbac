<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Who did the action
            $table->foreignId('user_id')->nullable()->index();

            // What was affected
            $table->string('auditable_type')->index();
            $table->unsignedBigInteger('auditable_id')->index();

            // Action info
            $table->string('event'); // created, updated, deleted, login, export, etc
            $table->string('url')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();

            // Data
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->json('metadata')->nullable();

            // Optional multi-tenant support
            $table->unsignedBigInteger('tenant_id')->nullable()->index();

            $table->timestamp('created_at')->useCurrent();

            // Fast searching
            $table->index(['auditable_type', 'auditable_id']);
            $table->index(['event']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
