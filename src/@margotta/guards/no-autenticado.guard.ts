import { inject } from '@angular/core'
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router'
import { AutenticacionService } from 'app/modules/autenticacion/autenticacion.service'
import { of, switchMap } from 'rxjs'

export const NoAutenticadoGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
	const router: Router = inject(Router);

	return inject(AutenticacionService)
		.Check()
		.pipe(
			switchMap((autenticado) => {
				if (autenticado) {
					return of(router.parseUrl(''));
				}

				return of(true);
			})
		);
};
