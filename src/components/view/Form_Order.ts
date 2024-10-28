import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './Form';
import { TPayInfo, PayMethods } from '../../types';

export class FormOrder extends Form<TPayInfo> {
	protected cashButton: HTMLButtonElement;
	protected cardButton: HTMLButtonElement;
	protected orderAdress: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this.orderAdress = ensureElement(
			'.form__input',
			this.container
		) as HTMLInputElement;
		this.cardButton = ensureElement(
			'.button_alt[name=card]',
			this.container
		) as HTMLButtonElement;
		this.cashButton = ensureElement(
			'.button_alt[name=cash]',
			this.container
		) as HTMLButtonElement;
		this.cardButton.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('payment', 'card');
		});
		this.cashButton.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});
	}

	set address(value: string) {
		this.orderAdress.value = value;
	}
	set payment(value: PayMethods) {
		this.toggleClass(this.cardButton, 'button_alt-active', value === 'card');
		this.toggleClass(this.cashButton, 'button_alt-active', value === 'cash');
	}
}
