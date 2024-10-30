export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};
export enum CategoryName {
	другое = 'card__category_other',
	дополнительное = 'card__category_additional',
	'хард-скил' = 'card__category_hard',
	кнопка = 'card__category_button',
}
export const errorMessage = [
	'поле не может быть пустым',
	'необходимо выбрать способ оплаты',
	'необходимо заполнить все поля',
];
export enum AppChanges {
	catalogChanged = 'catalog:changed',
	cardSelected = 'card:select',
	previewChanged = 'preview:changed',
    basketOpen = 'basket:open',
	basketAdd = 'basket:add',
	basketDelete = 'basket:delete',
	modalOpen = 'modal:open',
	modalClose = 'modal:close',
	formOrderOpen = 'form_order:open',
	orderChange = 'order:change',
	formOrderReady = 'form_order:ready',
	formOrderSubmit = 'order:submit',
	contactsChange = 'contacts:change',
	formContactsReady = 'form_contacts:ready',
	formContactsSubmit = 'contacts:submit',
}
