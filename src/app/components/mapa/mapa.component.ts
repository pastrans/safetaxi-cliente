import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
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

  estadoRuta: string = "ZERO_RESULTS";
  ruta:Ruta
  mensajeError :String;
  mostrarError :boolean  = false;

  constructor() { }
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  public options={types: [], componentRestrictions: { country: 'SV' }};

  ngOnInit(): void {
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
    console.log(address);
    console.log('Latitud : ' + address.geometry.location.lat());
    console.log('Longitud : ' + address.geometry.location.lng());

    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
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
    console.log(event);
  }

  public getStatus(status: any){
    console.log(status);
    this.estadoRuta = status;
    if(this.seCalculoLaRuta()){
    }else{
      this.notificarProblema();
    }

  }

  notificarProblema(){
    if(this.estadoRuta == "ZERO_RESULTS"){
        // si no se encuentran rutas
        this.mensajeError = "No se encontraron rutas";

    }else if(this.estadoRuta == "UNKNOWN_ERROR"){
      this.mensajeError = "La solicitud no se puedo procesar, Inténtalo de nuevo";
    }
    this.mostrarError = true;
  }

  seCalculoLaRuta(){
    if(this.estadoRuta == "OK"){
      this.mostrarError = false;
      return true;
    }else {
      return false;
    }
  }

 getcoords(type,event)
   {
       let coords=JSON.stringify(event);
       let coords3=JSON.parse(coords);
       console.log("updated latitude :: "+coords3.lat);
       console.log("updated longitude :: "+coords3.lng);
   }





}
