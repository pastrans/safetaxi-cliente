import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ViajeService } from 'src/app/servicios/viajes/viaje.service';
import { SolicitudService } from 'src/app/servicios/socket/solicitud.service';
import { Ruta , Coordenada} from '../../clases/ruta';
import Swal from 'sweetalert2';
import {MatAccordion} from '@angular/material/expansion';



@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})

export class MapaComponent implements OnInit {

  //------------------ Atributos ----------------------------------

  lat: number = 13.7161076 ;
  lng: number = -89.2056577 ;
  marcadorOrigen: any;
  public renderOptions = {
    suppressMarkers: true,
  }
  public markerOptions = {
    origin: {
      icon:'/',
    },
    destination: {
      icon:'/',
    },
  }

  public travelMode: string = 'DRIVING';

  // puntos de origen y destino
  origen : Coordenada;
  origenTitulo : string;

  destino : Coordenada;
  destinoTitulo : string;
  puntoBusqueda : Coordenada;
  puntoBusquedaTitulo : String;
  //badera
  hayDatos: boolean = false;

  estadoRuta: string = "ZERO_RESULTS";
  ruta:Ruta;
  latDestino:number;
  respuesta : string; // T terminado, R rechazado, A aceptado
  mensajeError :String;
  mostrarError :boolean  = false;
  busqueda     :boolean = false;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  public options={types: [], componentRestrictions: { country: 'SV' }};
  //tarifas
  tarifas : any;
  tarifasNormales : any;
  tarifasCondicionadas : any;
  tarifa : String = "0.00";

  //solicitud de viaje
  public esperandoConfirmacion : boolean = false;
  resultadoSolicitud : String = "Esperando respuesta";
  estadoSolicitud : Boolean = true;

  //chat
  mostrarChat : Boolean = false;

  //websocket
  user_id = 1;
  idViaje : Number = 0;
  constructor(private viajeService : ViajeService,
    private solicitudService : SolicitudService) { }

  ngOnInit(): void {
    this.iniciarWebsocket();
  }

  public handleAddressChange(address: Address) {
    console.log(address);
    this.puntoBusqueda = { lat : address.geometry.location.lat(), lng :address.geometry.location.lng() };
    this.busqueda = true;
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
  }

  //------------------ Métodos ----------------------------------
  clickMapa($event){
    this.busqueda = false;
    if( !this.existeOrigen() ){
      this.origen = { lat : $event.coords.lat, lng :$event.coords.lng };
    } else {
      if( !this.existeDestino() ){
        this.destino = { lat : $event.coords.lat, lng :$event.coords.lng };
        this.calcularTarifa();
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
      // ocultar marcadores originales
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
    }

  public onResponse(event: any){
    //console.log(event);
  }

  public getStatus(status: any){
    //console.log(status);
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

  busquedaclick($event){
    this.busqueda = false;
    console.log($event);
    console.log($event.latitude);
    if( !this.existeOrigen() ){
      this.origen = { lat : $event.latitude, lng : $event.longitude };
    } else {
      if( !this.existeDestino() ){
        this.destino = { lat : $event.latitude, lng : $event.longitude };
        this.calcularTarifa();
      }
    }
  }
  borrarMarcadorOri(){
    this.origen= null;
  }
  borrarMarcadorDes(){
    this.destino= null;
  }

 getcoords(type,event)
   {
       let coords=JSON.stringify(event);
       let coords3=JSON.parse(coords);
       //console.log("updated latitude :: "+coords3.lat);
       //console.log("updated longitude :: "+coords3.lng);
   }

   calcularTarifa(){
    let horaViaje = new Date().toString().split(' ')[4];
    let fechaViaje = new Date();
    let fechaViajeFormat = fechaViaje.getFullYear() + "-" + (fechaViaje.getUTCMonth() + 1) + "-" + fechaViaje.getDate();
    let data = {
      fechaViaje : fechaViajeFormat,
      horaViaje : horaViaje
    }
    this.viajeService.getTarifas(data).subscribe((tarifas : any) => {
      console.log("Distancia: " + this.ruta.distancia.valor/1000);
      this.tarifas = tarifas;
      this.tarifasNormales = this.tarifas.normales;
      this.tarifasCondicionadas = this.tarifas.condicionadas;
      let totalTarifa : any = 0;
      if(this.tarifasNormales.length > 0){
        for(let i = 0; i < this.tarifasNormales.length; i++){
          let tarifaActual = this.tarifasNormales[i];
          totalTarifa = Number(tarifaActual.valor) * (this.ruta.distancia.valor/1000);
        }
      }
      if(this.tarifasCondicionadas.length > 0){
        for(let i = 0; i< this.tarifasCondicionadas.length; i++){
          let tarifaActual = this.tarifasCondicionadas[i];
          let descuento = totalTarifa * Number(tarifaActual.valor);
          totalTarifa = totalTarifa + descuento;
        }
      }
      totalTarifa = Number(parseFloat(totalTarifa.toString()).toFixed(2));
      this.tarifa = totalTarifa.toString();
    });
  }

  solicitarViaje(){
    if(!this.esperandoConfirmacion){
      let data = {
        origenCoordenadas : this.origen.lat + "," + this.origen.lng,
        destinoCoordenadas : this.destino.lat + "," + this.destino.lng,
        origenTexto : this.ruta.direccionInicio.texto,
        destinoTexto : this.ruta.direccionFin.texto,
        total : this.tarifa,
        user_id : 1
      }
      this.viajeService.solicitarViaje(data).subscribe(
        (res : any) => {
          Swal.fire(
            'Solicitud',
            'Se ha registrado su solicitud',
            'success'
          );
          this.mostrarChat = true;
          this.idViaje = res.id;
          this.enviarSolicitud();
          this.esperandoConfirmacion = true;
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      Swal.fire(
        'Información',
        'Actualmente espera la confirmación de un viaje',
        'warning'
      )
    }
  }

  iniciarWebsocket(){
    this.solicitudService.solicitudes.subscribe(resp => {
      let response = JSON.parse(resp.data);
      if(response.user == this.user_id){
        this.respuesta = response.tipoRespuesta;
        if(this.respuesta == 'R')
          this.mostrarChat = false;
        if(this.respuesta == 'T')
          this.mostrarChat = false;
        this.resultadoSolicitud = response.respuesta;
        this.estadoSolicitud = false;
      }
    })
  }

  enviarSolicitud(){
    let data = {
      tipo : "nueva_solicitud"
    }
    this.solicitudService.sendSolicitud(data);
  }

}
