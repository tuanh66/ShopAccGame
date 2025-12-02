<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->delete();
        DB::table('users')->insert([
            [
                'username'      => 'admin',
                'password'      => Hash::make('123456'),
                'role'          => 1,
                'email'         => 'admin@example.com',
                'balance'       => '1000000'
            ],
            [
                'username'      => 'ctv123',
                'password'      => Hash::make('123456'),
                'role'          => 2,
                'email'         => 'admin1@example.com',
                'balance'       => '1000000'
            ],
            [
                'username'      => 'tuandev',
                'password'      => Hash::make('123456'),
                'role'          => 0,
                'email'         => 'admin2@example.com',
                'balance'       => '1000000'
            ],
        ]);
    }
}
