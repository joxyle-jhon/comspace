<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class SupabaseStorageService
{
    /**
     * Upload a file to the configured Supabase Storage bucket and return its public URL.
     */
    public function upload(UploadedFile $file, string $directory): string
    {
        $bucket = config('supabase.storage_bucket');
        $baseUrl = config('supabase.url');
        $serviceKey = config('supabase.service_key');

        if (!$baseUrl || !$serviceKey || !$bucket) {
            throw new RuntimeException('Supabase storage is not configured.');
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg');
        $path = trim($directory, '/').'/'.Str::uuid().'.'.$extension;
        $mime = $file->getMimeType() ?: 'application/octet-stream';
        $contents = file_get_contents($file->getRealPath());

        if ($contents === false) {
            throw new RuntimeException('Unable to read uploaded file.');
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$serviceKey,
            'apikey' => $serviceKey,
            'Content-Type' => $mime,
            'x-upsert' => 'true',
        ])->withBody($contents, $mime)
            ->post("{$baseUrl}/storage/v1/object/{$bucket}/{$path}");

        if ($response->failed()) {
            throw new RuntimeException(
                'Supabase upload failed: '.$response->body()
            );
        }

        return $this->publicUrl($path);
    }

    /**
     * Build the public object URL for a path inside the bucket.
     */
    public function publicUrl(string $path): string
    {
        $bucket = config('supabase.storage_bucket');
        $baseUrl = config('supabase.url');

        return "{$baseUrl}/storage/v1/object/public/{$bucket}/".ltrim($path, '/');
    }

    /**
     * Delete an object by storage path or full public URL.
     */
    public function delete(string $pathOrUrl): void
    {
        $bucket = config('supabase.storage_bucket');
        $baseUrl = config('supabase.url');
        $serviceKey = config('supabase.service_key');

        if (!$baseUrl || !$serviceKey || !$bucket) {
            throw new RuntimeException('Supabase storage is not configured.');
        }

        $path = $this->extractPath($pathOrUrl, $bucket);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$serviceKey,
            'apikey' => $serviceKey,
        ])->delete("{$baseUrl}/storage/v1/object/{$bucket}/{$path}");

        if ($response->failed()) {
            throw new RuntimeException(
                'Supabase delete failed: '.$response->body()
            );
        }
    }

    private function extractPath(string $pathOrUrl, string $bucket): string
    {
        $marker = "/object/public/{$bucket}/";

        if (str_contains($pathOrUrl, $marker)) {
            return ltrim(Str::after($pathOrUrl, $marker), '/');
        }

        return ltrim($pathOrUrl, '/');
    }
}
