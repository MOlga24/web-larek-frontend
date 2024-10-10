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
export type PayMethods = 'card' | 'cash';
//интерфейс контактов пользователя
interface IContacts {
	email: string;
	phone: string;
}
//интерфейс деталей заказа

interface IOrderData{
	adress: string;
	paymethod: PayMethods;
}
//интерфейс проверки формы заказа
export interface IFormValidation {
	valid: boolean;
	errors: Partial<Record<keyof IOrder, string>>;
}
//Интерфейс полученного заказа
export interface IOrderResult {
    total: number;
}
//Интерфейс действия с окном заказа
interface IResultActions {
    onClick: () => void;
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
	orderItems: (order: IContacts) => Promise<IOrderResult>;
}

//типы для модальных окон: платеж и адрес, почта и телефон
export type TPayInfo = Pick<IOrderData, 'adress' | 'paymethod'>;
export type TOrderInfo = Pick<IContacts, 'email' | 'phone'>;
export type IOrder = TPayInfo & TOrderInfo

//Данные карточки товара для корзины
type IBasketItem = Pick<IItem, 'name' | 'price'>;


//VIEW
// интерфейс действий с карточкой
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
// отображение для заданного типа данных

interface IView {
	render(data?: object): HTMLElement;
}
// отображение страницы с каталогом и счетчиком
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
// отображение корзины
interface IBasketView {
	selected: string[];
	items: HTMLElement[];
	total: number;
}

//отображение для карточек товара
interface IItemsContainer {
	new (container: HTMLElement, events?: IEvents): IView;
}
//отображение модального окна
interface IModalData {
    content: HTMLElement;
}
//отображение для формы заказа
interface IFormOrder {
	new (container: HTMLElement, events?: IEvents): IView;
}
