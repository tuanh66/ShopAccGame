<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignUpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'      => 'required|string|min:3|max:50',
            'username'  => 'required|string|min:3|max:30|unique:users,username',
            'password'  => 'required|string|min:6|confirmed',
            'email'     => 'required|email|unique:users,email',
        ];
    }

    public function messages(): array
    {
        return [
            // Name
            'name.required' => 'Họ và tên không được để trống.',
            'name.string'   => 'Họ và tên phải là chuỗi ký tự.',
            'name.min'      => 'Họ và tên phải có ít nhất 3 ký tự.',
            'name.max'      => 'Họ và tên không được vượt quá 50 ký tự.',
            // Username
            'username.required' => 'Tên đăng nhập không được để trống.',
            'username.string'   => 'Tên đăng nhập phải là chuỗi ký tự.',
            'username.min'      => 'Tên đăng nhập phải có ít nhất 3 ký tự.',
            'username.max'      => 'Tên đăng nhập không được vượt quá 30 ký tự.',
            'username.unique'   => 'Tên đăng nhập đã tồn tại.',

            // Password
            'password.required'  => 'Mật khẩu không được để trống.',
            'password.string'    => 'Mật khẩu phải là chuỗi ký tự.',
            'password.min'       => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',

            // Email
            'email.required' => 'Email không được để trống.',
            'email.email'    => 'Email không đúng định dạng.',
            'email.unique'   => 'Email đã tồn tại.',
        ];
    }
}
