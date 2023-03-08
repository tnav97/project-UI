import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize } from 'rxjs/operators';
import { Role } from '../models';

const users = [
  {
    id: 1,
    username: 'superadmin',
    password: 'superadmin',
    firstName: 'Admin',
    lastName: 'User',
    role: Role.SuperAdmin,
  },
  {
    id: 2,
    username: 'partner',
    password: 'partner',
    firstName: 'Normal',
    lastName: 'User',
    role: Role.Partner,
  },
  {
    id: 3,
    username: 'seeker12',
    password: 'seeker12',
    firstName: 'Normal',
    lastName: 'User',
    role: Role.Seeker,
  },
  {
    id: 4,
    username: 'user123',
    password: 'user123',
    firstName: 'Normal',
    lastName: 'User',
    role: Role.User,
  },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { username, password } = body;
      const user = users.find((x) => x.username === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: `fake-jwt-token.${user.id}`,
      });
    }

    function getUsers() {
      if (!isAdmin()) return unauthorized();
      return ok(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      // only admins can access other user records
      if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

      const user = users.find((x) => x.id === idFromUrl());
      return ok(user);
    }

    // helper functions

    function ok(body) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    }

    function unauthorized() {
      return throwError({
        status: 401,
        error: { message: 'unauthorized' },
      }).pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function error(message) {
      return throwError({ status: 400, error: { message } }).pipe(materialize(), delay(500), dematerialize());
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
      return isLoggedIn() && currentUser().role === Role.SuperAdmin;
    }

    function currentUser() {
      if (!isLoggedIn()) return;
      const id = parseInt(headers.get('Authorization').split('.')[1]);
      return users.find((x) => x.id === id);
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
