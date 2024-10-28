import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { CDN_URL, API_URL, errorMessage, appChanges } from './utils/constants';
import { ItemDataApi } from './components/base/ItemDataApi';
import { Basket } from './components/view/Basket';
import { cloneTemplate } from './utils/utils';
import { Page } from './components/view/Page';
import { AppState } from './components/base/ItemData';
import { Modal } from './components/common/Modal';
import { ensureElement } from './utils/utils';
import { Success } from './components/view/OrderSuccess';
import { IItemData, TOrderData } from './types';
import { Card } from './components/view/Card';
import { FormOrder } from './components/view/Form_Order';
import { FormContacts } from './components/view/Form_Contacts';

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

events.on(appChanges.catalogChanged, () => {
	page.counter = appData.order.items.length;
	page.catalog = appData.catalog.map((item) => {
		const catalogItem = new Card('card', cloneTemplate(catalogTemplate), {
			onClick: () => events.emit(appChanges.cardSelected, item),
		});
		return catalogItem.render(item);
	});
});
events.on(appChanges.cardSelected, (item: IItemData) => {
	appData.setPreview(item);
});
events.on(appChanges.previewChanged, (item: IItemData) => {
	const ItemPreview = new Card('card', cloneTemplate(itemPreviewTemplate), {
		onClick: () => events.emit(appChanges.basketAdd, item),
	});
	if (item.selected == true) {
		ItemPreview.buttonText = 'Удалить из корзины';
	}
	modal.render({ content: ItemPreview.render(item) });
});

// Блокируем прокрутку страницы если открыта модалка

events.on(appChanges.modalOpen, () => {
	page.locked = true;
});

// ... и разблокируем

events.on(appChanges.modalClose, () => {
	page.locked = false;
});

events.on(appChanges.basketOpen, () => {
	if (
		appData.order.total === 0 &&
		(appData.order.items.length === 0 || appData.order.items.length === 1)
	) {
		basket.setHidden();
		basket.toggleButton(false);
	} else {
		if (basket.toggleButton) {
			basket.toggleButton(true);
		}
	}
	modal.render({ content: basket.render() });
});

events.on(appChanges.basketAdd, (item: IItemData) => {
	modal.close();
	appData.order.items.some((it) => it.id === item.id)
		? appData.removeFromBasket(item)
		: appData.addToBasket(item);
	setBasket();
});

function setBasket() {
	basket.total = appData.getTotalSum() + ' ' + 'синапсов';
	page.counter = appData.order.items.length;
	basket.items = appData.order.items.map((item) => {
		const basketItem = new Card('card', cloneTemplate(basketCardTemplate), {
			onClick: () => events.emit(appChanges.basketDelete, item),
		});
		basketItem.index = appData.order.items.indexOf(item) + 1;
		return basketItem.render(item);
	});
}

events.on(appChanges.basketDelete, (item: IItemData) => {
	appData.removeFromBasket(item);
	if (appData.order.total == 0) {
		basket.toggleButton(false);
		basket.setHidden();
	}
	setBasket();
});

events.on(appChanges.formOrderOpen, () => {
	appData.clearOrder();
	modal.render({
		content: formOrder.render({
			payment: '',
			address: '',
			valid: false,
			errors: errorMessage[2],
		}),
	});
});

events.on(
	/^order\..*:change$/,
	(data: { field: keyof TOrderData; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(appChanges.orderChange, (errors) => {
	if (errors) {
		formOrder.valid = !Object.keys(errors).length;
		formOrder.errors = Object.values(errors).join('  ');
	} else {
		formOrder.errors = '';
	}
});
events.on(appChanges.formOrderReady, () => {
	formOrder.valid = true;
});
events.on(appChanges.formOrderSubmit, () => {
	modal.render({
		content: formContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: errorMessage[2],
		}),
	});
});

events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof TOrderData; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on(appChanges.formContactsReady, () => {
	formContacts.valid = true;
});
events.on(appChanges.contactsChange, (errors) => {
	if (errors) {
		//(!Object.keys(errors).length == false)
		formContacts.valid = !Object.keys(errors).length;
		formContacts.errors = Object.values(errors).join('');
	} else {
		formContacts.errors = '';
	}
});

// Отправлена форма заказа
events.on(appChanges.formContactsSubmit, () => {
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
	appData.clearBasket();
	basket.items = [];
	basket.total = '';
	events.emit(appChanges.catalogChanged);
	api
		.orderItems(order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.total = result.total;
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
