import { IEvents } from '../components/base/events';

//интерфейс карточки товара
export interface IItemData {
	id: string;
	description: string;
	image: string;
    title: string;	 
	category: string;
	price: number;
    // selected?:true| false;	
	
}
export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type ItemStatus = 'selected' | 'not selected';
export type  IItem = IItemData & ItemStatus;
export interface IItemStatus{
    status: ItemStatus;
    
}
export interface IAppState {
    catalog: IItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
export type PayMethods = 'card' | 'cash';
//интерфейс контактов пользователя
interface IContacts {
	email: string;
	phone: string;
}
//интерфейс деталей заказа

export interface IOrderData {
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
// //интерфейс каталога товаров
// export interface IItemsCatalog {
// 	items: IItemData;
// 	preview: string | null;
// 	setItem(item: IItemData[]): void;
// 	// getItem(id: string): IItemData;
// }
//интерфейс заказа
export interface IOrder {
	items: string[];
	// total: number | null;
	payment: PayMethods;
	adress: string;
	email: string;
	phone: string;
	valid: boolean;
	// errors: Partial<Record<keyof TOrderData, string>>;
}
//интерфейс корзины
export interface IBasketModel {
	items: TBasketItem;
	add(id: string): void;
	remove(id: string): void;
	total: string | number;
}

//интерфейс АПИ(получение данных)
export interface IItemAPI {
	getItems: () => Promise<IItemData[]>;
	getItem: (id: string) => Promise<IItemData>;
	orderItems: (order: IContacts) => Promise<IOrderResult>;
}

//типы для модальных окон: платеж и адрес, почта и телефон
export type TPayInfo = Pick<IOrderData, 'adress' | 'paymethod'>;
export type TOrderInfo = Pick<IContacts, 'email' | 'phone'>;
export type TOrderData = TPayInfo & TOrderInfo
export type TItemData ={ _id: string;
name: string;
   description: string;
   price: string;
   category: string[];
   image: string;
   status: string;}
//Данные карточки товара для корзины
type TBasketItem = Pick<IItemData, "title"| "price">;

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
