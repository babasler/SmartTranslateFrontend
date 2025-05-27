import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_gh9RDotOf',
    redirectUrl: 'https://bastian-basler.de',   
    postLogoutRedirectUri: 'https://bastian-basler.de',    
    clientId: '34fiokko0g853qqd750osf419j',
    scope: 'email openid phone',
    responseType: 'code'
  },
}


//Nach dem Testen auf Localhost, wieder auf richtige Domain umstellen
//https://bastian-basler.de