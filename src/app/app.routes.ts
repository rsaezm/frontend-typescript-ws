import { Routes } from '@angular/router'
import { AuthComponent } from './layout/auth/auth.component'
import { MainComponent } from './layout/main/main.component'
import { HomeComponent } from './modules/home/home.component'
import { initialDataResolver } from './app.resolver'
import { AutenticadoGuard, NoAutenticadoGuard } from '@margotta'

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },

	{
		path: 'autenticacion',
		component: AuthComponent,
		canActivate: [NoAutenticadoGuard],
		canActivateChild: [NoAutenticadoGuard],
		children: [
			{ path: '', loadChildren: () => import('./modules/autenticacion/autenticacion.routes') }
		]
	},
	{
		path: '',
		component: MainComponent,
		canActivate: [AutenticadoGuard],
		canActivateChild: [AutenticadoGuard],
		resolve: {
			initialData: initialDataResolver
		},
		children: [
			{ path: 'home', loadChildren: () => import('app/modules/home/home.routes') },
			{ path: 'usuarios', loadChildren: () => import('app/modules/usuarios/usuarios.routes') }
		]
	}
]
