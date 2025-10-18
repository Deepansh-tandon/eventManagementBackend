const { ZodError } = require('zod');

function errorHandler(err, req, res, next) {
	if (res.headersSent) return next(err);

	if (err instanceof ZodError) {
		return res.status(400).json({
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: 'Invalid request',
				details: err.issues
			}
		});
	}

	const status = err.status || err.statusCode || 500;
	const code = err.code || 'INTERNAL_SERVER_ERROR';
	const message = err.message || 'Something went wrong';

	return res.status(status).json({
		success: false,
		error: {
			code,
			message,
			details: err.details
		}
	});
}

module.exports = errorHandler;


