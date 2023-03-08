import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { environment } from 'src/environments/environment';
import { ApiConfiguration } from './api/flexcub-api/api-configuration';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { ErrorInterceptor, fakeBackendProvider, JwtInterceptor } from './core/helpers';
import { ThemeModule } from './theme/theme.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    ThemeModule.forRoot(),
    HttpClientModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    ApiConfiguration,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: LocationStrategy, useClass: PathLocationStrategy },
    // provider used to create fake backend
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private base: ApiConfiguration) {
    base.rootUrl = `${environment.apiPrefix}${environment.apiFlexcub}`;
  }
}
