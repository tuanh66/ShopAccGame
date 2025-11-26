<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|min:3|max:30',
            'password' => 'required|string|min:6',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Tên đăng nhập không được để trống.',
            'username.string'   => 'Tên đăng nhập phải là chuỗi ký tự.',
            'username.min'      => 'Tên đăng nhập phải có ít nhất 3 ký tự.',
            'username.max'      => 'Tên đăng nhập không được vượt quá 30 ký tự.',

            'password.required' => 'Mật khẩu không được để trống.',
            'password.string'   => 'Mật khẩu phải là chuỗi ký tự.',
            'password.min'      => 'Mật khẩu phải có ít nhất 6 ký tự.',
        ];
    }
}
