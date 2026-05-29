const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).render("inventory/create", {
            errors: result.array(),
            body: req.body,
        });
    }

    next();
};

module.exports = validateRequest;