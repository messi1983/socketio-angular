import { Injectable } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs/internal/Observable'
import { AuthService } from '../services/auth/auth.service'
import { map, mergeMap } from 'rxjs/operators'


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  urlsToNotUse: Array<string>

  constructor(private auth: AuthService) {
    this.urlsToNotUse= [
      'http://localhost:9298/users/signin',
    ];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    /*const authToken = this.auth.getAuthorizationToken('lmessi', 'testitou123')*/

    if (this.isValidRequestForInterceptor(req.url)) {
      return this.auth.getAuthorizationToken('jacques@gmail.com', 'Testing123')
      .pipe(
        map((authToken: string) => {
          return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
          })
        }),
        mergeMap((authReq) => next.handle(authReq))
      )
    }
    return next.handle(req)
  }

  private isValidRequestForInterceptor(requestUrl: string): boolean {
    for (let url of this.urlsToNotUse) {
      if (new RegExp(url).test(requestUrl)) {
        return false
      }
    }
    return true
  }
}