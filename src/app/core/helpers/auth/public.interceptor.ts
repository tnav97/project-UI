import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH } from './constant/auth.constant';

@Injectable()
export class PublicInterceptor<T> implements HttpInterceptor {
  intercept(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (req.body instanceof FormData) {
      const authReq = req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${AUTH.TOKEN}`,
          'X-Domain': `${AUTH.DOMAIN}`,
          'X-Tenant-Id': `${AUTH.TENANT}`,
        }),
      });
      return next.handle(authReq);
    }
    const authReq = req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${AUTH.TOKEN}`,
        'X-Domain': `${AUTH.DOMAIN}`,
        'X-Tenant-Id': `${AUTH.TENANT}`,
        'Content-Type': `application/json`,
      }),
    });

    return next.handle(authReq);
  }
}
