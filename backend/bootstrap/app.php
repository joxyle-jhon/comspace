<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $errorResponse = static function (
            string $code,
            string $message,
            int $status,
            array $details = [],
            array $additional = [],
        ): JsonResponse {
            $error = [
                'code' => $code,
                'message' => $message,
            ];

            if ($details !== []) {
                $error['details'] = $details;
            }

            return response()->json(array_merge([
                'success' => false,
                'error' => $error,
            ], $additional), $status);
        };

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (ValidationException $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $errorResponse(
                'VALIDATION_ERROR',
                'The given data was invalid.',
                422,
                $exception->errors(),
                ['errors' => $exception->errors()],
            );
        });

        $exceptions->render(function (AuthenticationException $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $errorResponse('AUTHENTICATION_REQUIRED', 'Authentication is required.', 401);
        });

        $exceptions->render(function (AuthorizationException $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $errorResponse('FORBIDDEN', 'You are not authorized to perform this action.', 403);
        });

        $exceptions->render(function (ModelNotFoundException $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $errorResponse('RESOURCE_NOT_FOUND', 'The requested resource was not found.', 404);
        });

        $exceptions->render(function (ThrottleRequestsException $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $errorResponse('TOO_MANY_REQUESTS', 'Too many requests. Please try again later.', 429);
        });

        $exceptions->render(function (MethodNotAllowedHttpException $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $errorResponse('METHOD_NOT_ALLOWED', 'The request method is not allowed for this endpoint.', 405);
        });

        $exceptions->render(function (NotFoundHttpException $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $errorResponse('ROUTE_NOT_FOUND', 'The requested endpoint was not found.', 404);
        });

        $exceptions->render(function (HttpExceptionInterface $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $errorResponse(
                'HTTP_ERROR',
                'The request could not be completed.',
                $exception->getStatusCode(),
            );
        });

        $exceptions->render(function (Throwable $exception, Request $request) use ($errorResponse) {
            if (! $request->is('api/*')) {
                return null;
            }

            report($exception);

            return $errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred.', 500);
        });
    })->create();
