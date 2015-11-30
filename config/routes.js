var user = require('./../authorization.js');

module.exports = function(app, config, passport) {
	app.get("/", function(req, res) {
		if(req.isAuthenticated()) {
		  res.render("home",
		  	{
		  		user : req.user
		  	});
		} else {
			res.render("home",
				{
					user : null
				});
		}
	});

	app.get("/login",
		passport.authenticate(config.passport.strategy,
		{
			successRedirect : "/",
			failureRedirect : "/login"
		})
	);

	app.post('/login/callback',
		passport.authenticate(config.passport.strategy,
			{
				failureRedirect: '/',
				failureFlash: true
			}),
		function(req, res) {
			res.redirect('/');
		}
	);

	//app.get("/denied", function (req, res) {
	//	res.render("denied");
	//});

	app.get("/signup", function (req, res) {
		res.render("signup");
	});

	app.get("/profile", function(req, res) {
    	if(req.isAuthenticated()){
			res.render("profile",
				{
					user : req.user
				});
   		} else {
    	    res.redirect("/login");
	    }
	});

	app.get("/private", user.is('moderator'), function(req, res) {
    	if(req.isAuthenticated()){
			res.render("private",
				{
					user : req.user
				});
   		} else {
    	    res.redirect("/login");
	    }
	});

	app.get("/admin", user.is('admin'), function(req, res) {
    	if(req.isAuthenticated()){
			res.render("admin",
				{
					user : req.user
				});
   		} else {
    	    res.redirect("/login");
	    }
	});

	app.post('/auth/saml/logout/callback', passport.logoutSamlCallback);

    app.get('/logout',
        passport.authenticate(config.passport.strategy, { session: false }),
        function(req, res) {
            res.json({ id: req.user.id, username: req.user.username });
            req.logout();
            req.session = null;
            req.session.destroy();
            res.render('loggedout');
        });
};