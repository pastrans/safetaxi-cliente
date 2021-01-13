import { Component, OnInit } from '@angular/core';
import { Ruta } from '../../clases/ruta'
interface Coordenada {
  lat: number;
  lng: number;
}


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})

export class MapaComponent implements OnInit {

  //------------------ Atributos ----------------------------------

  lat: number = 13.7161076 ;
  lng: number = -89.2056577 ;

  public travelMode: string = 'DRIVING';

  // puntos de origen y destino
  origen : Coordenada;
  destino : Coordenada;

  //badera
  hayDatos: boolean = false;

  ruta:Ruta

  constructor() { }

  ngOnInit(): void {
  }


  //------------------ Métodos ----------------------------------
  clickMapa($event){
    if( !this.existeOrigen() ){
      this.origen = { lat : $event.coords.lat, lng :$event.coords.lng };
    } else {
      if( !this.existeDestino() ){
        this.destino = { lat : $event.coords.lat, lng :$event.coords.lng };
      }
    }
  }

  existeOrigen():Boolean {
    if(this.origen  == null ){
      return false
    }
    return true
  }

  existeDestino():Boolean {
    if(this.destino  == null ){
      return false
    }
    return true
  }

  calcularRuta():Boolean  {
    if (this.existeDestino() == true && this.existeOrigen() == true ){
      return true
    }
    return false;
  }

  cambiandoPosicionOrigen($event){
    this.origen = { lat : $event.coords.lat, lng :$event.coords.lng };
  }

  cambiandoPosicionDestino($event){
    this.destino = { lat : $event.coords.lat, lng :$event.coords.lng };
  }
  //--------- métodos para la etiqueta agm-direction---------------------------
  onChange($event){
    let data = $event.routes[0].legs[0];
    this.ruta = new Ruta (data);
    this.hayDatos = true;
    console.log(this.ruta);
  }

  public onResponse(event: any){
    console.log("En respuesta");
    console.log(event);
    // You can do anything.
  }
  public getStatus(status: any){
    console.log(status);
  }

  getcoords(type,event)
    {
        let coords=JSON.stringify(event);
        let coords3=JSON.parse(coords);
        console.log("updated latitude :: "+coords3.lat);
        console.log("updated longitude :: "+coords3.lng);
    }




}
