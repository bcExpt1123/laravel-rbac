<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentChild extends Pivot
{
    use SoftDeletes, Auditable;

    protected $table = 'parent_children';
    public $incrementing = true;  // 👈 important!
    protected $keyType = 'int';   // optional, but good to clarify
}
