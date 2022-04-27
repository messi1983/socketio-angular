import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Socket } from 'socket.io-client';
import { SocketioService } from '../services/socketio/socketio.service';
import { AuthService } from '../services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @Input()
  user: any
  @Input()
  room!: String
  
  @ViewChild('message')
  textElement!: ElementRef

  disabledTextMessage: boolean = false
  messageForm!: FormGroup
  socket!: Socket

  messages!: any[]

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private socketService: SocketioService
  ) {}

  ngOnInit(): void {

    this.messageForm = this.formBuilder.group({
      text: ''
    })

    this.auth.getAuthorizationToken(environment.MS_USERS_EMAIL, environment.MS_USERS_PASSWORD)
    .subscribe((token: string) => {
      this.socket =  this.socketService.setupSocketConnection('llouis', 'room123', token)
    
      this.socket.on("message", (msg) => {
        if (!this.messages) {
          this.messages = []
        } 
        this.messages.push(msg)
        //autoscroll()
      })

      this.socket.emit('join', { username: 'llouis', room: 'room123' }, (error: any) => {
        if (error) {
            alert(error)
            location.href = '/'
        }
      })

      this.socketService.findMessagesByRoom('room123')
                        .subscribe((data: any) => this.messages = [ ...data ])
    })

  }
  
  ngOnDestroy() {
    this.socketService.disconnect()
  }

  ngAfterViewInit() {
    this.textElement.nativeElement.focus()
  }

  onSubmit(): void {
    this.disabledTextMessage = true
    
    let msg = {
        content: this.messageForm.controls['text'].value,
        room: this.room
    }

    this.socketService.sendMessage(msg, (error: any) => {
      this.disabledTextMessage = false
      this.messageForm.reset()
      this.textElement.nativeElement.focus()      
      if (error) {
        return console.log(error)
      }
      console.log('Message delivered!')
    })
  }

}
