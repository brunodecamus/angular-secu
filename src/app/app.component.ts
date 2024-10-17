import { Component } from '@angular/core';
import { BroadcastService, MsalService, } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-secu';

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private broadcastService: BroadcastService, private authService: MsalService) { }

  ngOnInit() {

    this.isIframe = window !== window.parent && !window.opener;
    console.info('isIframe:', this.isIframe);

    this.broadcastService.subscribe("msal:loginFailure", payload => {
      console.info('msal:loginFailure : ', payload);
    });

    this.broadcastService.subscribe("msal:loginSuccess", payload => {
      console.info('msal:loginSuccess : ', payload);
      console.info('msal:loginSuccess : ', payload.account);
      console.info('msal:loginSuccess : ', payload.account.name);
      console.info('msal:loginSuccess : ', payload.account.idToken.roles);
    });


    this.authService.handleRedirectCallback((authError, response) => {
      console.info('handleRedirectCallback authError:', authError);
      console.info('handleRedirectCallback response:', response);
    });


    this.broadcastService.subscribe("msal:acquireTokenSuccess", payload => {
      console.info('msal:acquireTokenSuccess : ', payload);
    });

    this.broadcastService.subscribe("msal:acquireTokenFailure", payload => {
      console.info('msal:acquireTokenFailure : ', payload);
    });

  }


  login() {

    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    console.info('isIE:', isIE);

    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginPopup();
    }

  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
