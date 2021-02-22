import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BackendCommunicationService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private remoteServerUrl = 'https://demo-api.now.sh/users';

  constructor(private http: HttpClient) { }

  signUp(payload): Observable<any> {
    return this.http.post(this.remoteServerUrl, payload, this.httpOptions);
  }
}
