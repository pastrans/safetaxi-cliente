import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
//url = 'http://3.238.112.205:8080/api/';
url = 'http://safataxi.api/api/';

constructor(private http: HttpClient) { }

registrarUsuario(datos){
  /* Se crea un objeto nuevo ya que el formulario no tiene el campo para
  elegir el tipo de usuario.
  */
  const payload = {...datos, tipoUsuario: 'C'};
  return this.http.post(`${this.url}usuarios`, payload);
}
}
