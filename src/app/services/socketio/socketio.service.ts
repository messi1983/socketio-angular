import { Injectable } from '@angular/core'
import { io } from 'socket.io-client'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/internal/Observable'

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket: any

  constructor(
    private http: HttpClient
  ) { }

  setupSocketConnection(username: String, room: String, token: string): any {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      auth: {
        token
      }
    })
    this.joinRoom(username, room)
    return this.socket
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect()
    }
  }

  joinRoom(username: String, room: String) {
    this.socket.emit('join', { username, room }, (error: any) => {
      if (error) {
          alert(error)
          location.href = '/'
      }
    })
  }

  sendMessage(msg: any, callBack: Function) {
    this.socket.emit("message", msg, () => callBack())
  }

  findMessagesByRoom(room: String): Observable<any> {
    return this.http.get(`${environment.MS_MESSAGES_BASE_URL}/rooms/${room}/messages`)
  }

}
