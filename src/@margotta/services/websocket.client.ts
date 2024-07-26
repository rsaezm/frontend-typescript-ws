import { Injectable } from '@angular/core'
import { Socket, io } from 'socket.io-client'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { environment } from 'environments/environment'

@Injectable({
	providedIn: 'root'
})
export class WebsocketClient {

	private isConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	get IsConnected$(): Observable<boolean> { return this.isConnected$.asObservable() }

	private socket: Socket = io(environment.Websocket, { autoConnect: false })

	constructor() {
		this.isConnected$.next(false)
		this.socket.on('connect', () => this.isConnected$.next(true))
		this.socket.on('disconnect', () => this.isConnected$.next(false))
	}

	public on<T>(event: string): Observable<T> {
		return new Observable<T>(observer => {
			this.socket.on(event, (data: T) => {
				console.log({ event, data })
				observer.next(data)
			})

			return () => this.socket.off(event)
		})
	}

	public emit(event: string, data: any): void {
		this.socket.emit(event, data)
	}

	public Conectar(accessToken: string) {
		this.socket.io.opts.extraHeaders = { authorization: accessToken }
		this.socket.connect()
	}

	public Desconectar() {
		this.socket.disconnect()
	}
}
