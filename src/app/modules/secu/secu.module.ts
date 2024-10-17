import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { LogLevel, Logger } from 'msal';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(logLevel, message, piiEnabled) {
  console.log(message);
}

/**
 * 
 * MsalService : Le service à injecter dans les composants pour pouvoir s’abonner aux différents événements 
 *               créés durant l’authentification ou tout simplement lancer une connexion ou déconnexion.
 * MsalGuard : Ce protecteur de route va permettre d’empêcher tout utilisateur non authentifié 
 *             d’accéder aux routes auxquelles il sera assigné.
 * MsalInterceptor: Cet intercepteur de requête va automatiquement chercher les jetons qui ont été 
 *                  générés au moment de l’authentification pour les ajouter aux requêtes sortantes.
 * 
 */

@NgModule({
  imports: [
    MsalModule.forRoot({
      auth: {
        clientId: 'ebd453a5-bd05-4343-861e-ef71eb7ed032',
        authority: 'https://login.microsoftonline.com/37cd273a-1cec-4aae-a297-41480ea54f8d',
        validateAuthority: true,
        redirectUri: 'http://localhost:4200/',
        postLogoutRedirectUri: 'http://localhost:4200/',
        navigateToLoginRequestUrl: true,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
      system: {
        logger: new Logger(loggerCallback, {
          correlationId: '1234',
          level: LogLevel.Verbose,
          piiLoggingEnabled: true,
        }),
      }
    },
      {
        popUp: !isIE,
        unprotectedResources: ['https://www.microsoft.com/en-us/'],
        protectedResourceMap: [
          ['https://graph.microsoft.com/v1.0/me', ['user.read']],
          ['https://api.myapplication.com/users/*', ['customscope.read']]
        ],
        extraQueryParameters: {}
      })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ]
})
export class SecuModule { }
