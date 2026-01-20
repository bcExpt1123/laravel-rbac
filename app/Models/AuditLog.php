<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false; // we use created_at only

    protected $fillable = [
        'user_id',
        'tenant_id',
        'auditable_type',
        'auditable_id',
        'event',
        'url',
        'ip_address',
        'user_agent',
        'old_values',
        'new_values',
        'metadata',
        'created_at'
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'metadata'   => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function auditable()
    {
        return $this->morphTo();
    }
}
