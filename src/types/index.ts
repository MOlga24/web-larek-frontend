import { IEvents } from '../components/base/events';

//интерфейс карточки товара
export interface IItem {
	_id: string;
	name: string;
	description: string;
	price: string;
	category: string[];
	image: string;
	satus: string;
}

//интерфейс контактов пользователя
interface IContact {
	adress: string;
	email: string;
	phone: string;
	paymethod: string;
	setEmail(email: string): void;
	setPhone(phone: string): void;
	clear(): void;
}

//интерфейс каталога товаров
export interface IItemsCatalog {
	items: IItem[];
	preview: string | null;
	setItem(item: IItem[]): void;
	getItem(id: string): IItem;
}

//интерфейс корзины
export interface IBasketModel {
	items: IBasketItem;
	add(id: string): void;
	remove(id: string): void;
	total: string | number;
}

//интерфейс АПИ(получение данных)
export interface IItemAPI {
	getItems: () => Promise<IItem[]>;
	getItem: (id: string) => Promise<IItem>;
	orderItems: (order: IContact) => Promise<IOrderResult>;
}

//типы для модальных окон: платеж и адрес, почта и телефон
export type TPayInfo = Pick<IContact, 'adress' | 'paymethod'>;
export type TOrderInfo = Pick<IContact, 'email' | 'phone'>;

//Интерфейс для формы заказа
export interface IOrderFormData {
	contacts: IContact;
	isActive: boolean;
	isDisabled: boolean;
	message: string;
	total: string;
	isError: boolean;
}

//Интерфейс для работы с настройками формы заказа

export interface IOrderFormSettings {
	onChange: (data: IContact) => void;
	onClose: () => void;
	onNext: () => void;
	onBack: () => void;
}
//Интерфейс полученного заказа
export interface IOrderResult {
	id: string;
}

//Данные карточки товара для корзины
type IBasketItem = Pick<IItem, 'name' | 'price'>;

// Интерфейс состояния заполненной формы заказа
interface IFormState {
	valid: boolean;
	errors: string[];
}

//VIEW

// отображение для заданного типа данных

interface IView {
	render(data?: object): HTMLElement;
}

// отображение корзины
interface IBasketView {
	id: string;
	items: HTMLElement[];
	total: number;
}

//отображение для карточек товара
interface IItemsContainer {
	new (container: HTMLElement, events?: IEvents): IView;
}

//отображение для формы заказа
interface IFormOrder {
	new (container: HTMLElement, events?: IEvents): IView;
}
