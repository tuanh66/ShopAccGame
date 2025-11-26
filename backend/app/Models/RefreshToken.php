<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefreshToken extends Model
{
    protected $fillable = [
        'user_id',
        'refresh_token',
        'expires_at',
        'ip_address',
        'user_agent',
        'device',
        'platform',
        'browser',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
