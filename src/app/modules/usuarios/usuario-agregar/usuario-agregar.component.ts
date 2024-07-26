import { JsonPipe } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, finalize, of, Subject, Subscription, takeUntil, tap } from 'rxjs'
import { UsuariosService } from '../usuarios.service'
import { MatDividerModule } from '@angular/material/divider'
import { IUsuarioEntity } from 'dominio/interfaces'
import { MatDialog } from '@angular/material/dialog'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
	selector: 'usuario-agregar',
	standalone: true,
	imports: [
		FormsModule,
		JsonPipe,
		MatButtonModule,
		MatDividerModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
	],
	templateUrl: './usuario-agregar.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuarioAgregarComponent implements OnInit, OnDestroy {
	private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
	private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
	private formBuilder: FormBuilder = inject(FormBuilder);
	private router: Router = inject(Router);
	private unsubscribeAll: Subject<Subscription[]> = new Subject<Subscription[]>();
	private usuariosService: UsuariosService = inject(UsuariosService);

	public Form: FormGroup

	public ngOnInit(): void {
		this.Form = this.formBuilder.group({
			CorreoElectronico: this.formBuilder.control('', { validators: [Validators.required, Validators.email] }),
			Username: this.formBuilder.control('', { validators: [] }),
			Password: this.formBuilder.control('', { validators: [Validators.required] }),
		})

		this.usuariosService.Usuario$
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe(response => {
				this.Form.patchValue(response)
				this.changeDetectorRef.markForCheck()
			})
	}

	public ngOnDestroy(): void {
		this.unsubscribeAll.next(null)
		this.unsubscribeAll.complete()

		this.usuariosService.Reset()
	}

	public Cancelar() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute })
	}

	public Submit() {
		if (this.Form.invalid) return

		const entity: IUsuarioEntity = this.Form.value

		this.Form.disable()

		this.usuariosService.Crear(entity)
			.pipe(
				takeUntil(this.unsubscribeAll),
				tap(() => this.Cancelar()),
				catchError((response: HttpErrorResponse) => {
					alert(response.error.additionalInfo?.message || response.error.message || 'Ups!, se ha producido un error al guardar la información')
					return of(false)
				}),
				finalize(() => {
					this.Form.enable()
					this.changeDetectorRef.markForCheck()
				}),
			)
			.subscribe()
	}
}