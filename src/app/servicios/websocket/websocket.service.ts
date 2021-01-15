import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // Our socket connection
  private socket;

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io("http://localhost:5000");

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
        this.socket.on('solicitud', (data) => {
          console.log("Received message from Websocket Server");
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
            this.socket.emit('solicitud', JSON.stringify(data));
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }

  connectChat() : Rx.Subject<MessageEvent>{
    this.socket = io("http://localhost:5000");
    
    let observable = new Observable(observer => {
      this.socket.on('chat', (data) => {
        //console.log("Mensaje recibido: " + data);
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });

    let observer = {
      next : (data : Object) => {
        this.socket.emit('chat', JSON.stringify(data));
      }
    }

    return Rx.Subject.create(observer, observable);
  }

  getRespuesta(user_id){
    let observable = new Observable(observer => {
      this.socket.on('solicitud', (data) => {
        if(data.user_id === user_id){
          observer.next(data.data);
        }
      })
    })
  }

}
