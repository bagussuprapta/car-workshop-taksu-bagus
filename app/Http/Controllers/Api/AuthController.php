<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|unique:users',
                'password' => 'required|string|min:6',
                'role'     => 'nullable|in:admin,car_owner,mechanic',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => $request->role ?? 'car_owner',
            ]);

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'User registered successfully',
                'token'   => $token,
                'user'    => $user,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'message' => 'Invalid credentials',
                ], 401);
            }

            return response()->json([
                'message' => 'Login successful',
                'token'   => $token,
                'user'    => JWTAuth::user(),
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Could not create token',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::getToken();

            if (!$token) {
                return response()->json(['message' => 'Token not provided'], 400);
            }

            JWTAuth::invalidate($token);

            return response()->json(['message' => 'Successfully logged out']);
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Failed to logout, token invalid or expired',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            return response()->json($user);
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Token is invalid or expired',
                'error'   => $e->getMessage(),
            ], 401);
        }
    }
}
