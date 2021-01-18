import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  url = 'http://safetaxi.api/api';

  login(datos){
    return this.http.post(`${this.url}/login`, datos);
  }

}
