import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/servicios/viajes/viaje.service';
import { Ruta } from '../../clases/ruta'
import Swal from 'sweetalert2'
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

  //tarifas
  tarifas : any;
  tarifasNormales : any;
  tarifasCondicionadas : any;
  tarifa : String = "0.00";

  //solicitud de viaje
  public esperandoConfirmacion : boolean = false;
  resultadoSolicitud : String = "Esperando respuesta";

  constructor(private viajeService : ViajeService) { }

  ngOnInit(): void {
  }


  //------------------ Métodos ----------------------------------
  clickMapa($event){
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
      //console.log(this.ruta);
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
        (res) => {
          Swal.fire(
            'Solicitud',
            'Se ha registrado su solicitud',
            'success'
          )
          this.esperandoConfirmacion = true;
        },
        (error) => {
          console.log(error)
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

}
