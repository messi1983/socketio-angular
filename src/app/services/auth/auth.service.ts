import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'


@Injectable({
    providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  getAuthorizationToken(email: string, password: string): Observable<string> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    const payload = JSON.stringify({
        email: email,
        password: password
    })

    return this.http.post(`${environment.MS_USERS_BASE_URL}/signin`, payload, httpOptions)
      .pipe(map((response: any) => {
        return response.access_token
      })
    )
  }
}