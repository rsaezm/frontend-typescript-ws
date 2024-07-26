import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
	selector: 'layout-auth',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {

}
