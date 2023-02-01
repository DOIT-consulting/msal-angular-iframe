import { LogLevel } from "@azure/msal-browser";

const API_URL = '<API_URL>';

export const environment = {
  production: false,
  graphApi: 'https://graph.microsoft.com',
  apiUrl: API_URL,
  logLevel: LogLevel.Verbose,
  azureAD: {
    clientId: '<CLIENT_ID>',
    authority: 'https://login.microsoftonline.com/<TENANT_IT>',
    redirectUri: '/',
    protectedRerouces: new Map<string, string[]>([
      [API_URL + '/*', ['api://<API_ID>/<API_SCOPE>']]
    ]),
    scopes: ['user.read']
  }
};