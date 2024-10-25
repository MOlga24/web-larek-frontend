import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { ISuccess, ISuccessActions } from '../types';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected totalSum: HTMLParagraphElement;
	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this.totalSum = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
	set total(value: number) {
		this.setText(this.totalSum, 'Списано' + ' ' + value + ' ' + 'синапсов');
	}
}
