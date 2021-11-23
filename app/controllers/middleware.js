export const isLogged = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

export const isNotLogged = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}