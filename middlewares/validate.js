const { ZodError } = require('zod');

const validate = (schema, source = 'body') => {
	return (req, res, next) => {
		try {
			const data = req[source];
			const parsed = schema.parse(data);
			req[source] = parsed;
			return next();
		} catch (err) {
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
			return next(err);
		}
	};
};

module.exports = validate;





