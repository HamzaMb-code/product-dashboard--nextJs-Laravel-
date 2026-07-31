<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    // Register API (name,email,password,confirm_password)
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required |string |min:3 | max:200',
            'email' => 'required |email |unique:users,email',
            'password' => 'required | string | min:8| confirmed'
        ]);
        $data["password"] = Hash::make($data["password"]);

        User::create($data);

        return response()->json([
            "status" => true,
            "message" => "User registered successfully"
        ], 201);
    }

    //Login API (email,password)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                "status" => false,
                "message" => "Email or password is not correct !!"
            ], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $token = $user->createToken("myToken")->plainTextToken;

        return response()->json([
            "status" => true,
            "message" => "User logged in",
            "token" => $token
        ], 200);
    }


    //Profile API
    public function profile(Request $request) {
        $user = $request->user();
        return response()->json([
            "status"=> true,
            "message"=> "User profile data",
            "user"=> $user
        ]);
    }


    //Logout API
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status'=> true,
            "message"=> "Logged out successfully"
        ],200);
    }
}
