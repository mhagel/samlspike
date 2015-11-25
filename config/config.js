var fs = require('fs');

module.exports = {
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
