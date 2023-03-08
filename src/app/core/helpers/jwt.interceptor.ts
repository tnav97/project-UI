import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'src/app/pages/authentication/authentication.service';

const apiUrl = 'http://localhost:4203';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const user = this.authenticationService.userValue;
    const isLoggedIn = user;
    const isApiUrl = request.url.startsWith(apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user}`,
        },
      });
    }

    return next.handle(request);
  }
}
