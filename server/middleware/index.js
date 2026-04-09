const requiresLogin = (req, res, next) => {
    if (!req.session.account) {
        return res.redirect('/');
    }
    next();
}

const requiresLogout = (req, res, next) => {
    if (req.session.account) {
        return res.redirect('/maker');
    }

    return next();
}

const requiresSecure = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    next();
}

const bypassAdmin = (req, res, next) => {
    return next();
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassAdmin;
}




