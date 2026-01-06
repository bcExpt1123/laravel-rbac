<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Authorization handled in controller
        return true;
    }

    public function rules(): array
    {
        $userId = $this->input('user_id');

        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'unique:users,email' . ($userId ? ',' . $userId : ''),
            ],
            'password' => [
                $userId ? 'nullable' : 'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ];
    }
}
