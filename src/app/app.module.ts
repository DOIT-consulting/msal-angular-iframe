import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';

import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
  switch (logLevel) {
    case LogLevel.Error:
      console.error(message);
    case LogLevel.Info:
      console.info(message);
    case LogLevel.Warning:
      console.warn(message);
    default:
      console.log(message);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.azureAD.clientId,
        authority: environment.azureAD.authority,
        redirectUri: environment.azureAD.redirectUri
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      },
      system: {
        allowRedirectInIframe: true,
        loggerOptions: {
          loggerCallback,
          logLevel: LogLevel.Warning,
          piiLoggingEnabled: false
        }
      }
    }),
      {
        interactionType: InteractionType.Popup,
        authRequest: {
          scopes: environment.azureAD.scopes
        }
      },
      {
        interactionType: InteractionType.Popup,
        protectedResourceMap: environment.azureAD.protectedRerouces
      })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard,
    MsalService,
    MsalBroadcastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
