<?php

namespace Tests\Models;

use App\Concerns\HasTree;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasTree;

    protected $fillable = ['title', 'parent_id'];
    public $timestamps = false;
}
