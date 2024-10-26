import { IEvents } from './events';
import { Model } from './Model';
import { IItemData, IOrder, IAppState, TOrderData } from '../../types';

export class ItemData extends Model<IItemData> {
	id: string;
	title: string;
	category: string;
	image: string;
	price: number;
	description: string;
	selected: boolean;

	constructor(data: Partial<IItemData>, protected events: IEvents) {
		super(data, events);
	}
}

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
	valid: true;
	// preview: string | null;
	errorMessage = [
		'поле не может быть пустым',
		'необходимо выбрать способ оплаты',
		'необходимо заполнить все поля',
	];

	getItem(id: string): IItemData {
		return this.catalog.find((item) => id === item.id);
	}
	selectItem(id: string) {
		const item = this.getItem(id);
		item.selected = true;
		console.log(item);
		this.events.emit('items:changed');
	}

	setItems(items: IItemData[]) {
		items.map((item) => {
			if (item.price === null) {
				item.price = 0;
			}
			this.catalog.push(item);
		});
		this.emitChanges('items:changed', { items: this.catalog });
	}

	setOrderField(field: keyof TOrderData, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: string[] = [];
		if (!this.order.address && !this.order.payment) {
			errors.push(this.errorMessage[2]);
		} else {
			if (!this.order.address) {
				errors.push(this.errorMessage[0]);
			}
			if (!this.order.payment) {
				errors.push(this.errorMessage[1]);
			}
		}
		this.errors = errors;
		this.events.emit('order:change', this.errors);
		return Object.keys(errors).length === 0;
	}

	setPreview(item: IItemData) {
		//this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getTotalSum() {
		return this.order.items.reduce((partialSum, a) => partialSum + a.price, 0);
	}
	toggleOrderedItem(item: IItemData) {
		this.catalog.forEach((item) => {
			item.selected = false;
		});
	}

	clearBasket() {
		this.order.items.forEach((item) => {
			this.toggleOrderedItem(item);
			this.order.items = [];
			this.order.total = 0;
		});
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

	setContactsField(field: keyof TOrderData, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this);
		}
	}
	validateContacts() {
		const errors: string[] = [];
		if (!this.order.phone && !this.order.email) {
			errors.push(this.errorMessage[2]);
		} else {
			if (!this.order.phone) {
				errors.push(this.errorMessage[0]);
			}
			if (!this.order.email) {
				errors.push(this.errorMessage[1]);
			}
		}
		this.errors = errors;
		this.events.emit('contacts:change', this.errors);
		return Object.keys(errors).length === 0;
	}
}
