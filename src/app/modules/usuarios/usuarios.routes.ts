import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router'
import { UsuariosComponent } from './usuarios.component'
import { inject } from '@angular/core'
import { UsuariosService } from './usuarios.service'
import { UsuarioAgregarComponent } from './usuario-agregar/usuario-agregar.component'
import { UsuarioEditarComponent } from './usuario-editar/usuario-editar.component'

export default [
	{
		path: '',
		component: UsuariosComponent
	},
	{
		path: 'crear',
		component: UsuarioAgregarComponent
	},
	{
		path: 'editar/:id',
		component: UsuarioEditarComponent,
		resolve: {
			_: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(UsuariosService).Select(route.params.id)
		}
	},
] as Routes
