<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;

class RoleStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $roleId = $this->input('role_id');
        return [
            'role_id' => [
                'nullable',
                'exists:roles,id'
            ],
            'name' => ['required', 'string', 'max:255', 'unique:roles,name' . ($roleId ? ',' . $roleId : '')],
            'permissions' => [
                'required',
                'array',
                'min:1',
            ],
            'permissions.*' => [
                'string',
                'exists:permissions,name',
            ],
        ];
    }
}
