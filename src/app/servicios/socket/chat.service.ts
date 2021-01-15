import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  mensajes: Subject<any>;

  constructor(private wsService : WebsocketService) { 
    this.mensajes = <Subject<any>>wsService
    .connectChat()
      .map((response: any): any => {
        return response;
      });
  }

  enviarMensaje(data){
    this.mensajes.next(data);
  }
  
}
