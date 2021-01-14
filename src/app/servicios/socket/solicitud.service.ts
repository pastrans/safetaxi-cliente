import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  solicitudes: Subject<any>;

  constructor(private wsService : WebsocketService) { 
    this.solicitudes = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      })
  }
  
  sendSolicitud(data){
    this.solicitudes.next(data);
  }
  
  respuestaSolicitud(user_id : string){
    this.wsService.getRespuesta(user_id);
  }

}
