import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PopupRequest, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'msal-angular-iframe';
  silentLoginFailed = false;
  private readonly _destroying$ = new Subject<void>();
  isAuthenticated = false;
  activeUser: string | undefined = "unknown user";
  public authError!: string | null;

  get isLogged() {
    return this.authService.instance.getAllAccounts().length > 0;
  };
  get isIframe() {
    return window !== window.parent && !window.opener
  };

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadcastService: MsalBroadcastService,
    private authService: MsalService) { }

  async ngOnInit() {

    this.msalBroadcastService.msalSubject$
      .pipe(
        takeUntil(this._destroying$)
      )
      .subscribe(async (event: EventMessage) => {
        if (event.eventType == EventType.SSO_SILENT_SUCCESS || event.eventType == EventType.LOGIN_SUCCESS) {
          this.authService.instance.setActiveAccount((<any>event.payload)?.account);
        }
      })


    const accounts = this.authService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.authService.instance.setActiveAccount(accounts[0]);
    }
    else {
      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
        )
        .subscribe(() => {
          this.authService.handleRedirectObservable().subscribe(
            (data: AuthenticationResult) => {
              const account = this.authService.instance.getActiveAccount();
              if (!account && !this.authError) {
                this.sso();
                this.authError = "Login failed";
              }
            }
          )
        })
    }
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe({
          next: (response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
            this.authError = null;
          },
          error: (e) => {
            console.error(e)
            this.authError = e;
            this.silentLoginFailed = true;
          }
        });
    } else {
      this.authService.loginPopup()
        .subscribe({
          next: (response: AuthenticationResult) => {
            this.authError = null;
            this.authService.instance.setActiveAccount(response.account);
          },
          error: (e) => {
            console.error(e)
            this.authError = e;
            this.silentLoginFailed = true;
          }
        });
    }
  }

  sso() {
    this.silentLoginFailed = false;
    this.authService.ssoSilent({ ...this.msalGuardConfig.authRequest } as SilentRequest).subscribe({
      next: (response: AuthenticationResult) => {
        if (!response) {
          this.authError = "Failed ssoSilent";
        }
        else {
          this.authService.instance.setActiveAccount(response.account);
          this.authError = null;
        }
        console.info('sso complete');
      },
      error: (e) => {
        console.error(e)
        this.loginPopup();
        this.authError = e;
      }
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}