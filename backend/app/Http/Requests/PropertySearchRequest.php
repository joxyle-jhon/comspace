<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PropertySearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'location' => ['nullable', 'string', 'max:255'],
            'check_in' => ['required_with:check_out', 'date', 'after_or_equal:today'],
            'check_out' => ['required_with:check_in', 'date', 'after:check_in'],
            'guests' => ['nullable', 'integer', 'min:1', 'max:50'],
            'type' => [
                'nullable',
                Rule::in(['apartment', 'house', 'villa', 'cabin', 'studio', 'loft', 'condo', 'other']),
            ],
            'min_price' => ['nullable', 'integer', 'min:0'],
            'max_price' => ['nullable', 'integer', 'min:0', 'gte:min_price'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['integer', 'distinct', 'exists:amenities,id'],
            'instant_book' => ['nullable', 'boolean'],
            'sort' => ['nullable', Rule::in(['price_per_night', 'average_rating', 'created_at'])],
            'dir' => ['nullable', Rule::in(['asc', 'desc'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
