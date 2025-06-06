import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected pageCounter: HTMLElement;
	protected pageCatalog: HTMLElement;
	protected pageWrapper: HTMLElement;
	protected pageBasket: HTMLElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.pageCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this.pageCatalog = ensureElement<HTMLElement>('.gallery');
		this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
		this.pageBasket = ensureElement<HTMLElement>('.header__basket');
		this.pageBasket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this.pageCounter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this.pageCatalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this.pageWrapper, 'page__wrapper_locked', value);
	}
}
