const { validationResult } = require('express-validator');

const validateRequest = (view, locals = {}) => (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).render(view, {
            errors: result.array(),
            body: req.body,
            ...locals
        });
    }

    next();
};

module.exports = validateRequest;