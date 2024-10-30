import { Model } from './base/Model';
import { IItemData, IOrder, IAppState, TOrderData } from '../types';
import { AppChanges, errorMessage } from '../utils/constants';

export class AppState extends Model<IAppState> {
	catalog: IItemData[] = [];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		payment: '',
		address: '',
		total: 0,
	};
	errors: {};
	valid: false;

	setItems(items: IItemData[]) {
		items.map((item) => {
			if (item.price === null) {
				item.price = 0;
			}
			this.catalog.push(item);
		});
		this.emitChanges(AppChanges.catalogChanged, { items: this.catalog });
	}

	setOrderField(field: keyof TOrderData, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit(AppChanges.formOrderReady, this.order);
		}
	}

	validateOrder() {
		const errors: string[] = [];
		if (!this.order.address && !this.order.payment) {
			errors.push(errorMessage[2]);
		} else {
			if (!this.order.address) {
				errors.push(errorMessage[0]);
			}
			if (!this.order.payment) {
				errors.push(errorMessage[1]);
			}
		}
		this.errors = errors;
		this.events.emit(AppChanges.orderChange, this.errors);
		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof TOrderData, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit(AppChanges.formContactsReady, this.order);
		}
	}

	validateContacts() {
		const errors: string[] = [];
		if (!this.order.phone && !this.order.email) {
			errors.push(errorMessage[2]);
		} else {
			Object.values(this.order).forEach((val) => {
				if (!val) {
					errors.push(errorMessage[0]);
				}
			});
		}
		this.errors = errors;
		this.events.emit(AppChanges.contactsChange, this.errors);
		return Object.keys(errors).length === 0;
	}

	setPreview(item: IItemData) {
		this.emitChanges(AppChanges.previewChanged, item);
	}

	getTotalSum() {
		return this.order.items.reduce((partialSum, a) => partialSum + a.price, 0);
	}
	toggleOrderedItem() {
		this.catalog.forEach((item) => {
			item.selected = false;
		});
	}

	clearBasket() {
		this.toggleOrderedItem();
		this.order.items = [];
		this.order.total = 0;
	}
	clearOrder() {
		this.order.address = '';
		this.order.payment = '';
		this.order.email = '';
		this.order.phone = '';
	}

	addToBasket(item: IItemData) {
		item.selected = true;
		this.order.items.push(item);
		this.order.total = this.getTotalSum();
	}

	removeFromBasket(item: IItemData) {
		item.selected = !true;
		this.order.items = this.order.items.filter((it) => it.id !== item.id);
		this.order.total = this.getTotalSum();
	}
}
