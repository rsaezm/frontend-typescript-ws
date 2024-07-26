import { inject } from '@angular/core'
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router'
import { AutenticacionService } from 'app/modules/autenticacion/autenticacion.service'
import { of, switchMap } from 'rxjs'

export const AutenticadoGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
	const router: Router = inject(Router)

	return inject(AutenticacionService)
		.Check()
		.pipe(
			switchMap((autenticado) => {
				if (!autenticado) {
					const redirectURL = state.url === '/autenticacion/cerrar-sesion' ? '' : `redirectURL=${state.url}`
					const urlTree = router.parseUrl(`autenticacion?${redirectURL}`)

					return of(urlTree)
				}

				return of(true)
			})
		)
}
