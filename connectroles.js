var authentication = require('your-authentication-module-here');
var ConnectRoles = require('connect-roles');
var express = require('express');
var app = express();

var user = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        var accept = req.headers.accept || '';
        res.status(403);
        if (~accept.indexOf('html')) {
            res.render('access-denied', {action: action});
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});

app.use(authentication)
app.use(user.middleware());

//anonymous users can only access the home page
//returning false stops any more rules from being
//considered
user.use(function (req, action) {
    if (!req.isAuthenticated()) return action === 'access home page';
})

//moderator users can access private page, but
//they might not be the only ones so we don't return
//false if the user isn't a moderator
user.use('access private page', function (req) {
    if (req.user.role === 'moderator') {
        return true;
    }
})

//admin users can access all pages
user.use(function (req) {
    if (req.user.role === 'admin') {
        return true;
    }
});


app.get('/', user.can('access home page'), function (req, res) {
    res.render('private');
});
app.get('/private', user.can('access private page'), function (req, res) {
    res.render('private');
});
app.get('/admin', user.can('access admin page'), function (req, res) {
    res.render('admin');
});

app.listen(3000);