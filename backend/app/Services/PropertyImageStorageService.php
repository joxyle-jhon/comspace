<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PropertyImageStorageService
{
    /**
     * Store an uploaded image on the public disk and return its public URL.
     */
    public function upload(UploadedFile $file, int $propertyId): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg');
        $filename = Str::uuid().'.'.$extension;
        $directory = "properties/{$propertyId}";

        $path = $file->storeAs($directory, $filename, 'public');

        return Storage::disk('public')->url($path);
    }
}
