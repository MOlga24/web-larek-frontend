import { Component } from '../base/Component';
import { ensureElement, createElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { AppChanges } from '../../utils/constants';
interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected basketList: HTMLElement;
	protected basketTotal: HTMLSpanElement;
	protected basketButton: HTMLButtonElement;
	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.basketTotal = this.container.querySelector('.basket__price');
		this.basketButton = this.container.querySelector('.basket__button');
		this.basketButton.addEventListener('click', () => {
			events.emit(AppChanges.formOrderOpen);
		});
	}
	set items(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
		} else {
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: string) {
		this.setText(this.basketTotal, total);
	}
	toggleButton(value: boolean) {
		this.setDisabled(this.basketButton, !value);
	}
	makeHidden() {
		this.setHidden(this.basketTotal);
	}
	makeVisible() {
		this.setVisible(this.basketTotal);
	}
}
