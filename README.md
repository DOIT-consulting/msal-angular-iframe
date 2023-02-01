# MsalAngularIframe

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.3.

The goal of the application is to use the msal authentication flow inside an iframe.
It uses the sso as first tentative and if is not possible the second tentative is the redirect flow and the last one is the popup. 

## Prerequisites

Before using `@azure/msal-angular`, [register an application in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app) to get your `clientId` and an Api to get the the apiUrl.

## Packages

This application uses the `@azure/msal-angular` package is available on NPM:
```
@azure/msal-browser @azure/msal-angular@latest
```

### Configure the application

Open `.src/environments/environment.ts` in an editor:
- Replace `API_URL` with the API url from the portal registration.
- Replace fields in `azureAD` object with the parameters you've obtained after creating your own user-flows.

## Build and running tests


First navigate to the root directory of the application and install the dependencies:

    npm install

Then use the following command to build the application:

    npm run build