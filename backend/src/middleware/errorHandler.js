// Centralized error handler. Keeps error shape consistent across the API
// and avoids leaking stack traces in production.
export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const response = { message: err.message || "Something went wrong." };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err.message);
  res.status(status).json(response);
}
