import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';

import { ItemDataApi } from './components/base/ItemDataApi';
import { Basket } from './components/Basket';
import { cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { AppState } from './components/base/ItemData';
import { Modal } from './components/common/Modal';
import { ensureElement } from './utils/utils';
import { Success } from './components/OrderSuccess';
import { IItemData, TOrderData } from './types';

import { Card } from './components/Card';
import { FormOrder } from './components/Form_Order';
import { FormContacts } from './components/Form_Contacts';

//templates
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const catalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const formOrderTemplate = document.querySelector(
	'#order'
) as HTMLTemplateElement;
const formContactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const itemPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const events = new EventEmitter();
// models
const appData = new AppState({}, events);
// const basketData = new BasketData({}, events);
// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formOrder = new FormOrder(cloneTemplate(formOrderTemplate), events);
const formContacts = new FormContacts(
	cloneTemplate(formContactsTemplate),
	events
);
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const api = new ItemDataApi(CDN_URL, API_URL);

api
	.getItemsList()
	.then((data) => {
		appData.setItems(data);
	})
	.catch((err) => {
		console.error(err);
	});

events.on('items:changed', () => {
	page.counter = appData.order.items.length;
	page.catalog = appData.catalog.map((item) => {
		const catalogItem = new Card('card', cloneTemplate(catalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return catalogItem.render(item);
	});
});
events.on('card:select', (item: IItemData) => {
	appData.setPreview(item);
});
events.on('preview:changed', (item: IItemData) => {
	const ItemPreview = new Card('card', cloneTemplate(itemPreviewTemplate), {
		onClick: () => events.emit('basket:add', item),
	});
	if (item.selected == true) {
		ItemPreview.buttonText = 'Удалить из корзины';
	}
	modal.render({ content: ItemPreview.render(item) });
});

// Блокируем прокрутку страницы если открыта модалка

events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:add', (item: IItemData) => {
	modal.close();
	appData.order.items.some((it) => it.id === item.id)
		? appData.removeFromBasket(item)
		: appData.addToBasket(item);
	basket.total = appData.getTotalSum() + ' ' + 'синапсов';
	page.counter = appData.order.items.length;
	basket.items = appData.order.items.map((item) => {
		const basketItem = new Card('card', cloneTemplate(basketCardTemplate), {
			onClick: () => events.emit('basket:delete', item),
		});
		basketItem.index = appData.order.items.indexOf(item) + 1;
		return basketItem.render(item);
	});
});
events.on('basket:open', () => {
	if (appData.order.total === 0 || appData.order.items.length === 0) {
		basket.toggleButton(false);
	} else {
		if (basket.toggleButton) {
			basket.toggleButton(true);
		}
	}
	modal.render({ content: basket.render() });
});

events.on('basket:delete', (item: IItemData) => {
	appData.removeFromBasket(item);
	if (appData.order.total == 0) {
		basket.toggleButton(false);
		basket.setHidden();
	}
	page.counter = appData.order.items.length;
	basket.total = appData.order.total + ' ' + 'синапсов';
	basket.items = appData.order.items.map((item) => {
		const basketItem = new Card('card', cloneTemplate(basketCardTemplate), {
			onClick: () => events.emit('basket:delete', item),
		});
		basketItem.index = appData.order.items.indexOf(item) + 1;
		return basketItem.render(item);
	});
});

events.on('form:open', () => {
	events.emit('address:change', { field: 'address', value: '' });
	modal.render({
		content: formOrder.render({
			payment: '',
			address: '',
			valid: false,
			errors: appData.errorMessage[2],
		}),
	});
});

// выбираем способ оплаты
events.on(
	'payment:change',
	(data: { field: keyof TOrderData; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	'address:change',
	(data: { field: keyof TOrderData; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);
events.on('order:change', (errors) => {
	if (!Object.keys(errors).length == false) {
		formOrder.valid = !Object.keys(errors).length;
		formOrder.errors = Object.values(errors).join('  ');
		formOrder.valid = false;
	} else {
		formOrder.errors = '';
	}
});
events.on('order:ready', () => {
	formOrder.valid = true;
});
events.on('order:submit', () => {
	events.emit('email:change', { field: 'email', value: '' });
	modal.render({
		content: formContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: appData.errorMessage[2],
		}),
	});
});

events.on(
	'email:change',
	(data: { field: keyof TOrderData; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on(
	'phone:change',
	(data: { field: keyof TOrderData; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);
events.on('contacts:ready', () => {
	formContacts.valid = true;
});
events.on('contacts:change', (errors) => {
	if (!Object.keys(errors).length == false) {
		formOrder.valid = !Object.keys(errors).length;
		formContacts.errors = Object.values(errors).join('');
		formContacts.valid = false;
	} else {
		formContacts.errors = '';
	}
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	appData.order.items.forEach((item) => {
		if (item.price == 0) {
			appData.removeFromBasket(item);
		}
	});
	const order = {
		items: appData.order.items.map((it) => it.id),
		payment: appData.order.payment,
		address: appData.order.address,
		email: appData.order.email,
		phone: appData.order.phone,
		total: appData.getTotalSum(),
	};

	api
		.orderItems(order)
		.then((result) => {
			console.log(result);
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.catalog.forEach((it) => {
						it.selected = false;
					});
					appData.clearBasket();
					basket.items = [];
					basket.total = '';
					events.emit('items:changed');
				},
			});
			success.total = appData.order.total;
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
