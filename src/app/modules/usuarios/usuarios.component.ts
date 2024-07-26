import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core'
import { IUsuarioType } from 'dominio/interfaces'
import { Subject, Subscription, takeUntil } from 'rxjs'
import { UsuariosService } from './usuarios.service'
import { JsonPipe } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { RouterLink } from '@angular/router'

@Component({
	selector: 'usuarios',
	standalone: true,
	imports: [
		JsonPipe,
		MatButtonModule,
		MatCardModule,
		RouterLink,
	],
	templateUrl: './usuarios.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuariosComponent implements OnInit, OnDestroy {
	private unsubscribeAll: Subject<Subscription[]> = new Subject<Subscription[]>();
	private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
	private usuariosService: UsuariosService = inject(UsuariosService);

	public Usuarios: IUsuarioType[] = [];

	ngOnInit(): void {
		this.usuariosService.Usuarios$
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe(response => {
				this.Usuarios = response

				this.changeDetectorRef.markForCheck()
			})
	}

	ngOnDestroy(): void {
		this.unsubscribeAll.next(null)
		this.unsubscribeAll.complete()
	}

	Delete(usuario: IUsuarioType) {
		this.usuariosService.Eliminar(usuario.Id)
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe()
	}
}
