import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  urlApi = "http://safetaxi.api/api";

  constructor(private http : HttpClient) { }

  getTarifas(data : any){
    return this.http.post(`${this.urlApi}/tarifasviaje`, data);
  }

  solicitarViaje(data : any){
    return this.http.post(`${this.urlApi}/viajesolicitar`, data);
  }

}
