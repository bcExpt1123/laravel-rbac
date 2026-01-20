<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
     public function index(Request $request)
    {
        $query = AuditLog::query()->with('user');

        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('user')) {
            $query->where('user_id', $request->user);
        }

        if ($request->filled('model')) {
            $query->where('auditable_type', $request->model);
        }

        if ($request->filled('ip')) {
            $query->where('ip_address', $request->ip);
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $perPage = $request->input('perPage', 10);
        $logs = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('audit/index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }

    public function show(AuditLog $auditLog)
    {
        $auditLog->load('user');
        return Inertia::render('audit/show', [
            'log' => $auditLog,
        ]);
    }
}
