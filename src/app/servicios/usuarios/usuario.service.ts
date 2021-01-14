import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
//url = 'http://3.238.112.205:8080/api/';
url = 'http://safetaxi.api/api';

constructor(private http: HttpClient) { }

  registrarUsuario(datos){
    return this.http.post(`${this.url}/usuarios`, datos);
  }
}
