import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UsuariosService } from './modules/usuarios/usuarios.service'

export const initialDataResolver = () => {
    const usuariosService = inject(UsuariosService);

    return forkJoin([
		usuariosService.Init()
    ]);
};
