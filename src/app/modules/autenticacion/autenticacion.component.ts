import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { catchError, finalize, of, Subject, Subscription, takeUntil, tap } from 'rxjs'
import { AutenticacionService } from './autenticacion.service'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
	selector: 'autenticacion',
	standalone: true,
	imports: [
		FormsModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
	],
	templateUrl: './autenticacion.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutenticacionComponent implements OnInit, OnDestroy, AfterViewInit {

	@ViewChild('correoElectronico') correoElectronicoElement: ElementRef

	private activatedRoute = inject(ActivatedRoute)
	private autenticacionService = inject(AutenticacionService)
	private formBuilder = inject(FormBuilder)
	private router = inject(Router)
	private unsubscribeAll: Subject<Subscription[]> = new Subject<Subscription[]>()

	public Form: UntypedFormGroup

	public ngOnInit(): void {
		this.Form = this.formBuilder.group({
			CorreoElectronico: this.formBuilder.control('', { validators: [Validators.required, Validators.email] }),
			Password: this.formBuilder.control('', { validators: [Validators.required] }),
		})
	}

	public ngOnDestroy(): void {
		this.unsubscribeAll.next(null)
		this.unsubscribeAll.complete()
	}

	public ngAfterViewInit(): void {
		setTimeout(() => {
			this.correoElectronicoElement.nativeElement.focus()
		}, 0)
	}

	public Submit() {
		if (this.Form.invalid) {
			return
		}

		this.Form.disable()

		this.autenticacionService
			.Login(this.Form.value)
			.pipe(
				takeUntil(this.unsubscribeAll),
				tap(() => {
					const redirectURL = this.activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect'

					this.router.navigateByUrl(redirectURL)
				}),
				catchError((response: HttpErrorResponse) => {
					return of(false)
				}),
				finalize(() => {
					this.Form.enable()
				}),
			)
			.subscribe()
	}
}
