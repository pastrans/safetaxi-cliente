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
  @Input() user_id: number;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  mensajeTexto = "";
  mensajes : Mensaje[] = [];
  selfMessage = false;

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
    let data = {
      id : this.idViaje,
      mensaje : this.mensajeTexto,
      user_id: this.user_id,
      tipo : "externo"
    }
    this.chatService.enviarMensaje(data);
    let mensaje : Mensaje = {tipo : "propio", mensaje : this.mensajeTexto};
    if(mensaje.mensaje != "")
      this.mensajes.push(mensaje);
    this.mensajeTexto = "";
  }

  chatSocket(){
    this.chatService.mensajes.subscribe(resp => {
      let response = JSON.parse(resp.messageData);
      if (response.id == this.idViaje){
        if(this.user_id != response.user_id){
          let newMessage : Mensaje = {mensaje : response.mensaje, tipo : response.tipo };
          if(newMessage.mensaje != "")
            this.mensajes.push(newMessage);
          this.selfMessage = false;
        }
      }
      //console.log(response);
    });
  }

  

}
