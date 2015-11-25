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
                    issuer : 'passport-saml',
                    //privateCert: fs.readFileSync('./certificate.crt', 'utf-8')
                }
            }

        }
    }
    var myDecryptionCert = fs.readFileSync('./certificate.crt', 'utf-8');
    console.log(myDecryptionCert);
    var strategy = new SamlStrategy(config, function() {} );
    var metadata = strategy.generateServiceProviderMetadata( myDecryptionCert );


    console.log(metadata);


}
