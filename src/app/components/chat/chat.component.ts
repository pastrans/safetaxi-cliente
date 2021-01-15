import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input } from '@angular/core';
import { ChatService } from 'src/app/servicios/socket/chat.service';

interface Mensaje{
  mensaje : String,
  tipo : String     //propio o externo
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @Input() idViaje: number;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  mensajeTexto = "";
  mensajes : Mensaje[] = [];

  constructor(private chatService : ChatService) { 
    
  }
  
  ngAfterViewChecked() {        
    this.scrollToBottom();
  } 

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  ngOnInit(): void {
    this.chatSocket();
  }
  
  enviarMensaje(){
    let mensaje : Mensaje = {tipo : "propio", mensaje : this.mensajeTexto};
    if(mensaje.mensaje != "")
      this.mensajes.push(mensaje);
    this.mensajeTexto = "";
    let data = {
      id : this.idViaje,
      mensaje : mensaje.mensaje,
      tipo : mensaje.tipo
    }
    this.chatService.enviarMensaje(data);
  }

  chatSocket(){
    this.chatService.mensajes.subscribe(resp => {
      let response = JSON.parse(resp.messageData);
      let newMessage : Mensaje = {mensaje : response.mensaje, tipo : "externo" };
      if(newMessage.mensaje != "")
        this.mensajes.push(newMessage);
      //console.log(response);
    });
  }

  

}
