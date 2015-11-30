var SamlStrategy = require('passport-saml').Strategy;

var fs = require('fs');

module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	passport.use(new SamlStrategy(
	  {
	    path: config.passport.saml.path,
	    entryPoint: config.passport.saml.entryPoint,
	    issuer: config.passport.saml.issuer,
        //privateCert: config.passport.saml.privateCert
	  },
	  function(profile, done) {
		return done(null,
			{
				id : profile.uid,
				email : profile.email,
				displayName : profile.cn,
				firstName : profile.givenName,
  				lastName : profile.sn
			});
	  })
	);

	passport.logoutSaml = function(req, res) {
		//Here add the nameID and nameIDFormat to the user if you stored it someplace.
		req.user.nameID = req.user.saml.nameID;
		req.user.nameIDFormat = req.user.saml.nameIDFormat;


		samlStrategy.logout(req, function(err, request){
			if(!err){
				//redirect to the IdP Logout URL
				res.redirect(request);
			}
		});
	};

	passport.logoutSamlCallback = function(req, res){
		req.logOut();
		res.redirect('/loggedout');
	};

    var config = {
        development : {
            app : {
                name : 'Passport SAML strategy example',
                port : process.env.PORT || 3000
            },
            passport: {
                strategy : 'saml',
                saml : {
                    path : '/login/callback',
                    entryPoint : 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
                    callbackUrl: '/',
                    host: 'localhost',
					logoutUrl: '/loggedout',
                    issuer : 'passport-saml',
					cert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqhkiG9w0BAQUFADCBiTELMAkGA1UEBhMCTk8xEjAQBgNVBAgTCVRyb25kaGVpbTEQMA4GA1UEChMHVU5JTkVUVDEOMAwGA1UECxMFRmVpZGUxGTAXBgNVBAMTEG9wZW5pZHAuZmVpZGUubm8xKTAnBgkqhkiG9w0BCQEWGmFuZHJlYXMuc29sYmVyZ0B1bmluZXR0Lm5vMB4XDTA4MDUwODA5MjI0OFoXDTM1MDkyMzA5MjI0OFowgYkxCzAJBgNVBAYTAk5PMRIwEAYDVQQIEwlUcm9uZGhlaW0xEDAOBgNVBAoTB1VOSU5FVFQxDjAMBgNVBAsTBUZlaWRlMRkwFwYDVQQDExBvcGVuaWRwLmZlaWRlLm5vMSkwJwYJKoZIhvcNAQkBFhphbmRyZWFzLnNvbGJlcmdAdW5pbmV0dC5ubzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAt8jLoqI1VTlxAZ2axiDIThWcAOXdu8KkVUWaN/SooO9O0QQ7KRUjSGKN9JK65AFRDXQkWPAu4HlnO4noYlFSLnYyDxI66LCr71x4lgFJjqLeAvB/GqBqFfIZ3YK/NrhnUqFwZu63nLrZjcUZxNaPjOOSRSDaXpv1kb5k3jOiSGECAwEAATANBgkqhkiG9w0BAQUFAAOBgQBQYj4cAafWaYfjBU2zi1ElwStIaJ5nyp/s/8B8SAPK2T79McMyccP3wSW13LHkmM1jwKe3ACFXBvqGQN0IbcH49hu0FKhYFM/GPDJcIHFBsiyMBXChpye9vBaTNEBCtU3KjjyG0hRT2mAQ9h+bkPmOvlEo/aH0xR68Z9hw4PF13w==',
                    //privateCert: fs.readFileSync('./certificate.crt', 'utf-8')
                }
            }

        }
    };
    //var myDecryptionCert = fs.readFileSync('./certificate.crt', 'utf-8');
    //console.log(myDecryptionCert);
    //var strategy = new SamlStrategy(config, function() {} );
    //var metadata = strategy.generateServiceProviderMetadata( myDecryptionCert );
    //
    //
    //console.log(metadata);


};
