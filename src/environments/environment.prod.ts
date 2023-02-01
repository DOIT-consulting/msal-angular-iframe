import { LogLevel } from "@azure/msal-browser";

const API_URL = '<API_URL>';

export const environment = {
  production: true,
  graphApi: 'https://graph.microsoft.com',
  apiUrl: API_URL,
  logLevel: LogLevel.Warning,
  azureAD: {
    clientId: '<PROD_CLIENT_IT>',
    authority: '<https://login.microsoftonline.com/TENANT_ID>',
    // redirectUri: '/',
    redirectUri: window.location.origin,
    protectedRerouces: new Map<string, string[]>([
      [API_URL + '/*', ['api://<API_ID>/<API_SCOPE>']]
    ]),
    scopes: ['user.read']
  }
};
