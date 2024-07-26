import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { WebsocketClient } from '@margotta'
import { Subject, Subscription, takeUntil } from 'rxjs'

@Component({
	selector: 'layout-main',
	standalone: true,
	imports:
		[
			MatButtonModule,
			RouterLink,
			RouterLinkActive,
			RouterOutlet,
		],
	templateUrl: './main.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {
	private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef)
	private websocketClient: WebsocketClient = inject(WebsocketClient);
	private unsubscribeAll: Subject<Subscription[]> = new Subject<Subscription[]>();

	public IsConnected: boolean = false;

	ngOnInit(): void {
		this.websocketClient.IsConnected$
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe(response => {
				this.IsConnected = response
				this.changeDetectorRef.markForCheck()
			})
	}

	ngOnDestroy(): void {
		this.unsubscribeAll.next(null)
		this.unsubscribeAll.complete()
	}
}
