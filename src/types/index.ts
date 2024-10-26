//интерфейс карточки товара
export interface IItemData {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	selected: boolean;
	// index?:number;
}
export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type ItemStatus = 'selected' | 'not selected';
export type IItem = IItemData & ItemStatus;
export interface IItemStatus {
	status: ItemStatus;
}
export interface IAppState {
	catalog: IItemData[];
	preview: string | null;
	order: IOrder | null;
	errors: {};
	valid: boolean;
}
export type PayMethods = 'card' | 'cash';
//интерфейс контактов пользователя
export interface IContacts {
	email: string;
	phone: string;
}
//интерфейс деталей заказа

export interface IOrderData {
	address: string;
	payment: string;
	email: string;
	phone: string;
	items: string[];
}
//интерфейс проверки формы заказа
export interface IFormValidation {
	valid: boolean;
}
//Интерфейс полученного заказа
export interface IOrderResult {
	total: number;
}

//интерфейс заказа
export interface IOrder {
	items: IItemData[];
	total: number | null;
	payment: string;
	address: string;
	email: string;
	phone: string;
}

//интерфейс АПИ(получение данных)
export interface IItemAPI {
	getItems: () => Promise<IItemData[]>;
	getItem: (id: string) => Promise<IItemData>;
	orderItems: (order: IContacts) => Promise<IOrderResult>;
}

//типы для модальных окон: платеж и адрес, почта и телефон
export type TPayInfo = Pick<IOrderData, 'address' | 'payment'>;

export type TOrderInfo = Pick<IContacts, 'email' | 'phone'>;

export type TOrderData = TPayInfo & TOrderInfo;

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
