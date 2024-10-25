import { ensureElement } from '../utils/utils';
import { IContacts } from '../types';
import { Form } from './Form';
import { IEvents } from './base/events';
export class FormContacts extends Form<IContacts> {
	protected inputPhone: HTMLInputElement;
	protected inputEmail: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this.inputEmail = ensureElement(
			'.form__input[name="email"]',
			this.container
		) as HTMLInputElement;
		this.inputPhone = ensureElement(
			'.form__input[name="phone"]',
			this.container
		) as HTMLInputElement;
	}

	set phone(value: string) {
		this.inputPhone.value = value;
	}
	set email(value: string) {
		this.inputEmail.value = value;
	}
}
