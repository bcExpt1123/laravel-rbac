<?php

namespace App\Concerns;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function ($model) {
            $model->writeAudit('created');
        });

        static::updated(function ($model) {
            $model->writeAudit('updated');
        });

        static::deleted(function ($model) {
            $model->writeAudit('deleted');
        });
    }

    public function writeAudit(string $event)
    {
        AuditLog::create([
            'user_id'        => Auth::id(),
            // 'tenant_id'      => tenant('id') ?? null, // optional
            'tenant_id'      => null, // optional
            'auditable_type' => get_class($this),
            'auditable_id'   => $this->getKey(),
            'event'          => $event,
            'url'            => Request::fullUrl(),
            'ip_address'     => Request::ip(),
            'user_agent'     => Request::userAgent(),
            'old_values'     => $event === 'updated' ? $this->getOriginal() : null,
            'new_values'     => $event !== 'deleted' ? $this->getAttributes() : null,
            'created_at'     => now(),
        ]);
    }
}
