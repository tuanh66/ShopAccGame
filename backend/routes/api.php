<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/auth/signup', [AuthController::class, 'signUp']);
Route::post('/auth/signin', [AuthController::class, 'signIn']);
Route::post('/auth/signout', [AuthController::class, 'signOut']);
Route::get('/users/auth-me', [AuthController::class, 'authMe'])->middleware('AuthMiddleware');
Route::post('/auth/check-field', [AuthController::class, 'checkField']);