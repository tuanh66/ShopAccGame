<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Lấy token từ header Authorization: Bearer <token>
            $authHeader = $request->header('Authorization');
            $token = $authHeader ? trim(str_replace('Bearer', '', $authHeader)) : null;

            if (!$token) {
                return response()->json(['message' => 'Không tìm thấy access token'], 401);
            }

            // Giải mã token
            try {
                $decoded = JWT::decode($token, new Key(env('ACCESS_TOKEN_SECRET'), 'HS256'));
            } catch (\Exception $e) {
                return response()->json(['message' => 'Access token hết hạn hoặc không đúng'], 403);
            }

            // Lấy user từ DB
            $user = User::find($decoded->userId);
            if (!$user) {
                return response()->json(['message' => 'Người dùng không tồn tại'], 404);
            }

            // Gắn user vào request để controller sử dụng
            $request->attributes->add(['user' => $user]);

            return $next($request);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi hệ thống', 'error' => $e->getMessage()], 500);
        }
    }
}
