<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\RefreshToken;
use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cookie;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use hisorange\BrowserDetect\Parser as BrowserDetect;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    const ACCESS_TOKEN_TTL = 1800; // 30 phút (tính bằng giây)
    const REFRESH_TOKEN_TTL = 1209600; // 14 ngày (tính bằng giây)

    public function signUp(SignUpRequest $request)
    {
        try {
            $data = $request->validated();

            $user = User::create([
                'username'     => $data['username'],
                'password'     => bcrypt($data['password']),
                'email'        => $data['email'],
                'role'         => User::ROLE_USER,
            ]);

            return response()->json([
                'message' => 'Đăng ký thành công',
                'user'    => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi hệ thống',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function signIn(SignInRequest $request)
    {
        try {
            $data = $request->validated();
            $username = $data['username'];
            $password = $data['password'];

            // tìm user theo username
            $user = User::where('username', $username)->first();
            if (!$user || !Hash::check($password, $user->password)) {
                return response()->json([
                    'message' => 'Tài khoản hoặc mật khẩu không đúng'
                ], 401);
            }

            // tạo access token JWT
            $accessToken = JWT::encode(
                ['userId' => $user->id, 'exp' => time() + self::ACCESS_TOKEN_TTL],
                env('ACCESS_TOKEN_SECRET'),
                'HS256'
            );


            $refreshToken = Str::random(128);
            $ip = $request->ip();
            $userAgent = $request->header('User-Agent');
            // tạo refresh token ngẫu nhiên
            $parser = new BrowserDetect();
            // lưu refresh token vào bảng sessions
            RefreshToken::create([
                'user_id'       => $user->id,
                'refresh_token' => $refreshToken,
                'expires_at'    => now()->addSeconds(self::REFRESH_TOKEN_TTL),
                'ip_address'    => $ip,
                'user_agent'    => $userAgent,
                'device'        => $parser->deviceFamily(),
                'platform'      => $parser->platformName(),
                'browser'       => $parser->browserName(),
            ]);

            // trả refresh token qua cookie
            $cookie = cookie(
                'refreshToken',
                $refreshToken,
                self::REFRESH_TOKEN_TTL / 60, // thời gian sống (phút)
                '/',                          // path
                null,                         // domain, null để mặc định domain hiện tại
                false,                        // secure, false khi dùng http
                true,                         // httpOnly
                false,                        // raw
                'Lax'                         // sameSite, dùng Lax cho localhost / Postman
            );

            // trả access token
            return response()->json([
                'message' => "User {$user->username} đã đăng nhập!",
                'accessToken' => $accessToken
            ])->withCookie($cookie);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi hệ thống',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function signOut(Request $request)
    {
        try {
            // lấy refresh token từ cookie
            $token = $request->cookie('refreshToken');

            if ($token) {
                // xóa refresh token trong database
                RefreshToken::where('refresh_token', $token)->delete();

                // xóa cookie
                Cookie::queue(Cookie::forget('refreshToken'));
            }

            return response()->noContent(); // status 204
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi hệ thống',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function authMe(Request $request)
    {
        try {
            $user = $request->attributes->get('user');
            $accessToken = $request->bearerToken();

            return response()->json([
                'info' => [
                    'username' => $user->username,
                    'balance'  => $user->balance,
                ],
                'jwt' => $accessToken,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi hệ thống',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function tokenRenewal(Request $request)
    {
        $refreshToken = $request->cookie('refreshToken');

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token không tồn tại'], 401);
        }

        $tokenRecord = RefreshToken::where('refresh_token', $refreshToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$tokenRecord) {
            return response()->json(['message' => 'Refresh token không hợp lệ hoặc hết hạn'], 401);
        }

        // Tạo accessToken mới
        $accessToken = JWT::encode(
            ['userId' => $tokenRecord->user_id, 'exp' => time() + self::ACCESS_TOKEN_TTL],
            env('ACCESS_TOKEN_SECRET'),
            'HS256'
        );

        return response()->json(['accessToken' => $accessToken]);
    }
}
