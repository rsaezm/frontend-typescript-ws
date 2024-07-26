import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { WebsocketClient } from '@margotta'
import { IUsuarioEntity, IUsuarioType, UsuarioEvents } from 'dominio/interfaces'
import { environment } from 'environments/environment.development'
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs'

@Injectable({
	providedIn: 'root'
})
export class UsuariosService {
	private httpClient: HttpClient = inject(HttpClient);
	private websocketClient: WebsocketClient = inject(WebsocketClient);
	private usuario$: ReplaySubject<IUsuarioType> = new ReplaySubject<IUsuarioType>(1);
	private usuarios$: BehaviorSubject<IUsuarioType[]> = new BehaviorSubject<IUsuarioType[]>([]);

	public get Usuario$(): Observable<IUsuarioType> { return this.usuario$.asObservable() }
	public get Usuarios$(): Observable<IUsuarioType[]> { return this.usuarios$.asObservable() }

	private set Usuario$(value: IUsuarioType) { this.usuario$.next(value) }
	private set Usuarios$(value: IUsuarioType[]) {
		value.sort((a: IUsuarioType, b: IUsuarioType) => a.CorreoElectronico.toLowerCase() > b.CorreoElectronico.toLowerCase() ? 1 : -1)
		this.usuarios$.next(value)
	}

	constructor() {
		this.websocketClient
			.on(UsuarioEvents.Crear)
			.subscribe((payload: IUsuarioType) => {
				this.Usuarios$ = [...this.usuarios$.value, payload]
			})

		this.websocketClient
			.on(UsuarioEvents.Actualizar)
			.subscribe((payload: IUsuarioType) => {
				const usuarios = this.usuarios$.value
				const indice = usuarios.findIndex(usuario => usuario.Id == payload.Id)
				if (indice != -1) {
					usuarios[indice] = payload
					this.Usuarios$ = usuarios
				}
			})

		this.websocketClient
			.on(UsuarioEvents.Eliminar)
			.subscribe((payload: IUsuarioType) => {
				const usuarios = this.usuarios$.value
				const indice = usuarios.findIndex(usuario => usuario.Id == payload.Id)
				if (indice != -1) {
					usuarios.splice(indice, 1)
					this.Usuarios$ = usuarios
				}
			})
	}

	public Init = (): Observable<IUsuarioType[]> =>
		this.httpClient.get<IUsuarioType[]>(`${environment.Api}/usuario`).pipe(tap(response => this.Usuarios$ = response));

	public Select = (id: string): Observable<IUsuarioType> =>
		this.usuarios$
			.pipe(
				map(usuarios => usuarios.find(usuario => usuario.Id == id)),
				tap(usuario => this.Usuario$ = usuario)
			);

	public Reset = () => this.Usuario$ = undefined;

	public Crear = (entity: IUsuarioEntity): Observable<void> =>
		this.httpClient.post<void>(`${environment.Api}/usuario`, entity);

	public Modificar = (id: any, entity: IUsuarioEntity): Observable<void> =>
		this.httpClient.patch<void>(`${environment.Api}/usuario/${id}`, entity);

	public Eliminar = (id: any): Observable<void> =>
		this.httpClient.delete<void>(`${environment.Api}/usuario/${id}`);
}
