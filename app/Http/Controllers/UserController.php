<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        
        // $users = User::paginate(10);  // 10 users per page

        // return Inertia::render('Users/Index', [
        //     'users' => $users,
        // ]);
    }
}
