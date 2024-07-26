import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { ILoginEntity, ILoginType } from '../../../dominio/interfaces'
import { BehaviorSubject, Observable, of, switchMap, throwError } from 'rxjs'
import { environment } from '../../../environments/environment.development'
import { WebsocketClient } from '@margotta'

@Injectable({
	providedIn: 'root'
})
export class AutenticacionService {
	private httpClient: HttpClient = inject(HttpClient);
	private websocketClient: WebsocketClient = inject(WebsocketClient);

	private autenticado: boolean = false;

	private set accessToken(value: string) {
		localStorage.setItem('accessToken', value)
	}

	private get accessToken(): string {
		return localStorage.getItem('accessToken') ?? ''
	}

	private set Autenticado(value: boolean) {
		this.autenticado = value
	}

	public get Autenticado(): boolean {
		return this.autenticado
	}

	public Login = (entity: ILoginEntity): Observable<boolean> => {
		if (this.autenticado)
			return throwError('El usuario ya está autenticado')


		return this.httpClient.post<ILoginType>(`${environment.Api}/autenticacion/login`, entity)
			.pipe
			(
				switchMap(response => {
					this.accessToken = response.Token
					this.autenticado = true
					this.websocketClient.Conectar(this.accessToken)
					return of(true)
				})
			)
	}

	public LoginConToken = (): Observable<boolean> => {
		if (this.autenticado)
			return throwError('El usuario ya está autenticado')


		this.autenticado = true
		this.websocketClient.Conectar(this.accessToken)

		return of(true)
	}

	public Logout(): Observable<any> {
		localStorage.removeItem('accessToken')

		this.autenticado = false

		return of(true)
	}


	public Check(): Observable<boolean> {
		if (this.autenticado) {
			return of(true)
		}

		if (!this.accessToken) {
			return of(false)
		}

		return this.LoginConToken()
	}
}