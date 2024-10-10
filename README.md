# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Интерфейс карточки товара
```
export interface IItem {
	_id: string;
	name: string;
	description: string;
	price: string;
	category: string[];
	image: string;
	satus: string;
}
```
Тип метода платежа
```
export type PayMethods = 'card' | 'cash';
```
Интерфейс контактов пользователя
```

interface IContacts {
	email: string;
	phone: string;
}
```
Интерфейс деталей заказа
```
interface IOrderData{
	adress: string;
	paymethod: PayMethods;
}
```
Интерфейс проверки формы заказа
```
export interface IFormValidation {
	valid: boolean;
	errors: Partial<Record<keyof TOrderData, string>>;
}
```
Интерфейс каталога товаров
```
export interface IItemsCatalog {
	items: IItem[];
	preview: string | null;
	setItem(item: IItem[]): void;
	getItem(id: string): IItem;
}
```
Интерфейс заказа
```
export interface IOrder{
    items: string[];
	total: number | null;
	payment: PayMethods;
	address: string;
	email: string;
	phone: string;
	valid: boolean;
errors: Partial<Record<keyof TOrderData, string>>;
}
```
Интерфейс корзины
```
export interface IBasketModel {
	items: IBasketItem;
	add(id: string): void;
	remove(id: string): void;
	total: string | number;
}
```
Интерфейс АПИ(получение данных)
```
export interface IItemAPI {
	getItems: () => Promise<IItem[]>;
	getItem: (id: string) => Promise<IItem>;
	orderItems: (order: IContacts) => Promise<IOrderResult>;
}
```
Типы для модальных окон: платеж и адрес, почта и телефон
```
export type TPayInfo = Pick<IOrderData, 'adress' | 'paymethod'>;
export type TOrderInfo = Pick<IContacts, 'email' | 'phone'>;
export type TOrderData = TPayInfo & TOrderInfo
```

Интерфейс полученного заказа
```
export interface IOrderResult {
    total: number;
}
```

Интерфейс действия с окном заказа
```
interface IResultActions {
    onClick: () => void;
}
```
Данные карточки товара для корзины
```
type IBasketItem = Pick<IItem, 'name' | 'price'>;

```

Интерфейс действий с карточкой
```
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
```
Отображение для заданного типа данных
```
interface IView {
	render(data?: object): HTMLElement;
}
```
Отображение страницы с каталогом и счетчиком
```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```
Отображение корзины
```
interface IBasketView {
	selected: string[];
	items: HTMLElement[];
	total: number;
}
```
Отображение для карточек товара
```
interface IItemsContainer {
	new (container: HTMLElement, events?: IEvents): IView;
}
```
Отображение модального окна
```
interface IModalData {
    content: HTMLElement;
}
```
Отображение для формы заказа
```
interface IFormOrder {
	new (container: HTMLElement, events?: IEvents): IView;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных,
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс API

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

Методы: 
- `handleResponse(response: Response): Promise<object>` - защищенный метод, принимает и обрабатывает ответ сервера.
- `get(uri: string)` - выполняет GET запрос на переданный в параметрах ендпойнт и возвращает промис с объектом, которым ответил сервер;
- `post(uri: string, data: object, method: ApiPostMethods = 'POST') ` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпойнт, переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

Типы:
- `ApiListResponse<Type>` - типизация ответа от сервера. В нем содержится общее количество полученных от сервера элементов и массив заданного типа из этих элементов.
- `type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'` - типы методов запросов.
#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\
Поля:

- `_events: Map<EventName, Set<Subscriber>` - Map из событий и подписчиков;

В конструкторе инициализируется свойство `_events`:
- `constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }`- новый Map, в который будут записаны события и  подписчики на них.

Основные методы, реализуемые классом, представлены во вспомогательном интрефейсе `IEvents`:
- `on` - подписка на событие; 
- `emit` - инициализация события с данными;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.\
Также в классе имеются методы:
- `off` - отписка от события;
- `onAll` - подписка одновременно на все события;
- `offAll` - сброс всех обработчиков.

Типы:
- `type EventName = string | RegExp` - типизация имени события (строка или регулярное выражение);
- `type Subscriber = Function` - типизация подписчика на событие(функция); 
- `type EmitterEvent = {eventName: string, data: unknown}` - типизация события эмиттера.

### Слой данных
#### Класс Model
Абстрактный класс базовой модели.

Поля:
- `events: IEvents ` - защищенное свойство, хранящее события.

Защищенный  конструктор принимает элемент контейнера и брокер событий.

- `protected constructor(container: HTMLElement, events: IEvents) {}`

Методы:
- `emitChanges(event: string, payload?: object)` - сообщает подписчикам об изменении модели.
#### Класс ItemsCatalog
Наследует класс Model, в качестве дженерика передается массив, реализующий интерфейс `IItemsCatalog`.

Класс отвечает за хранение и логику работы с данными карточек товара, полученных от сервера.

В полях класса хранятся следующие данные:

- `_items: IItem[]`- массив карточек товаров.
- `_preview: string | null` - id карточки товара, выбранной для просмотра в модальном окне;
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Также в классе имеются методы для взаимодействия с этими данными.
- `updateItem(item:IItem,status: string):void` - обновляет данные статуса карточки товара в каталоге (добавлена в корзину или нет). Если передан колбэк, то выполняет его после обновления, еcли нет, то вызывает событие изменения массива.
- `getItem` - возвращает карточку товара по ее id.

#### Класс Order
Наследует абстрактный класс Model.
Класс отвечает за хранение и логику работы с данными заказа текущего пользователя.\
 В полях класса хранятся следующие данные:

- `adress:string` - адрес пользователя;
- `email:string` - почта пользователя;
- `phone:string` - телефон пользователя;
- `paymethod:PayMethods` - выбранный пользователем способ оплаты;
- `errors: Partial<Record<keyof TOrderData, string>>;` - ошибки валидации.

Методы:
- `removeOrderData()` - очистить данные заказа;
- `validateContacts()` - валидация введенных контактов;
- `validateOrderData()` - валидация введенного адреса и  проверка, что выбранспособ оплаты;
#### Класс BasketModel
Наследует абстрактный класс Model.
Класс хранит данные о товарах, добавленных пользователем в корзину: их список и итоговую сумму к оплате. Наследует абстрактный класс Model
Поля класса хранят следующие данные:

- `items:IItem[]` - выбранные товары;
- `total: number | null` - общая сумма корзины.

Методы:

- `add(id: string):void` - добавление в корзину по id;
- `remove(id:string):void` - удаление из корзины по id;
- `getTotalPrice():number` - получить общую стоимость корзины;
- `protected _changed()` - изменение состояния корзины;
- `clear()` - очищение корзины.

### Классы представления
#### Класс Component
Абстрактный класс, который реализует логику управления DOM - элементами. Конструктор класса принимает контейнер, для размещения данных
  `protected constructor(container: HTMLElement) {}`

Поля:
  - `container` - контейнер, который будет помещаться нужный компонент(каталог, карточка)
  Класс содержит следующие методы управления DOM-элементами:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)`- переключение селекторов;
- `render(data?: Partial<T>): HTMLElement `- вернуть DOM-элемент.

Сеттеры:
- `setText` - позволяет установить текстовое содержимое элемента;
- `setImage` -позволяет установить изображение элемента;
- `setHidden` - позволяет скрыть элемент (например, для модалок);
- `setVisible` - позволяет показать элемент;
- `setDisabled` - позволяет изменить статус блокировки элемента (например, для кнопки формы).

#### Класс Form
Реализует отображение формы. Наследует абстрактный класс `Component`.
Конструктор класса принимает контейнер для поиска и брокер событий, затем инициализирует свойства и вешает слушатели на кнопки и поля формы.\
`constructor(protected container: HTMLFormElement, protected events: IEvents) `

Поля:
- `_submit: HTMLButtonElement` - элемент кнопки подтверждения;
- `_errors` -контейнер с сообщениями об ошибках валидации.
Сеттеры:
- `valid` - делает недоступной кнопку сабмита формы в зависимости от переданного состояния.
- `errors` - устанавливает переданное содержимое компонента с ошибками формы.
Методы:
- `onInputChange(field: keyof T, value: string)` - передает событие изменения поля с заданными параметрами;
- `render(state: Partial<T> & IFormState) ` - рендерит компонент формы.


#### Класс Modal
Наследует класс  `Component`. Реализует модальное окно.
Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
Конструктор принимает DOM-элемент модального окна на базе шаблона и брокер событий.
`constructor(container: HTMLElement, protected events: IEvents)`

Поля класса:
- `_closeButton: HTMLButtonElement` - элемент кнопки закрытия модального окна;
- `protected _content: HTMLElement` - содержимое окна;

Сеттеры:
- `set content(value: HTMLElement)` - меняет содержимое модального окна.

Методы:
- `open()` - открывает модальное окно, инициализирует событие открытия open;
- `close()` - закрывает и стирает содержимое модального окна, инициализирует событие закрытия close;
- `render(data: IModalData): HTMLElement` - рендерит модальное окно с переданным содержимым и открывает его.
Интерфейс данных, которые передаются в модальное окно\
`interface IModalData`

#### Класс Item

Отвечает за отображение карточки товаров, задавая в карточке данные названия, изображения, описания, категории, цены, статуса "выбрано" текущим пользователем. Класс используется для отображения карточек товаров на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
`constructor(ItemName: string,container: HTMLElement,events: EventEmitter){}`\
 Поля класса содержат элементы разметки элементов карточки. 

 Методы:
- `setData(itemData: IItem, userId: string): void` - заполняет атрибуты элементов карточки данными;
- `ischoosed(): boolean` - метод возвращает значение выбрано или нет пользователем;
- `deleteItem(): void` - метод для удаления разметки карточки;
- `render(): HTMLElement` - метод возвращает полностью заполненную карточку с установленными слушателями;
- `get(id):string` - возвращает уникальный id карточки товара;
- `changeButtonText(id):void` - метод для замены текста кнопки после добавления в корзину или удаления из корзины.


#### Класс Page
Наследует класс `Component` и  реализует главную страницу проекта - каталог товаров с корзиной и счетчиком. В конструктор принимает DOM- элемент главной страницы и брокер событий.
  ` constructor(container: HTMLElement, protected events: IEvents)`

Поля:
- `_counter: HTMLElement` - DOM-элемент, в котором будет отображаться количество товаров в корзине;
- `_catalog: HTMLElement` - DOM-элемент для отображения каталога товаров;
- `_wrapper` - DOM-элемент обертки на странице для того, чтобы заблокировать прокрутку страницы;
- `_basket: HTMLElement` - DOM-элемент для отображения корзины.
Сеттеры:
- `set counter(value: number)`- меняет значение счетчика на полученное;
- `set catalog(items: HTMLElement[])` - меняет содержимое каталога;
- `set locked(value: boolean) ` - меняет класс обертки страницы на полученное значение.

#### Класс BasketView
Класс имплементирует интерфейс IBasketModel, является расширением класса `Component.
Отвечает за отображение корзины. В конструктор принимает контейнер с HTML - элементами и брокер событий.
`constructor(container: HTMLElement, events: EventEmitter) {}`
Поля:
- `_list:  HTMLElement` - элемент содержимого корзины (карточек товаров);
- `_total:  HTMLElement` - элемента стоимости корзины;
- `_button: HTMLElement`- элемент конпки оформления заказа.

Методы:
- `render(data:{items:HTMLElement[]}):HTMLElement` - отображение корзины с товарами и ценой.

Сеттеры:
- `set total(price: number)` - меняет занчение общей суммы в заказе;
- `set items(items: HTMLElement[])` - меняет содержимое в корзине.

#### Класс Contacts
Наследует класс `Form`, в качестве дженерика передается интерфейс `IContacts`.
Отвечает за отображение формы, содержащей информацию о контактах пользователя:  почта, телефон.
Поля

- `_email: HTMLInputElement` - DOM-элемент инпута почты;
- `_phone: HTMLInputElement` - DOM-элемент инпута телефона.
Конструктор класс в качестве аргументов принимает контейнерс формой и брокер событий. В конструкторе инициализируются защищенные свойства, а также добавляются слушатели инпуты.

`constructor(container: HTMLFormElement, events: IEvents)`

Сеттеры:

- `set email(value: string)` - сеттер для почты;
- `set phone(value: string)` - сеттер для телефона.

Типы и интерфейсы:

`interface IContacts` - интерфейс данных о контактах юзера, неоюходимый для рендера формы.
#### Класс OrderData
Наследует абстрактный класс Form, в качестве дженерика передается интерфейс `IOrderData`. Отвечает за отображение формы, содержащей информацию о деталях доставки: адрес и способ оплаты.

Поля

- `_card: HTMLButtonElement` - кнопка для выбора способа оплаты: card;
- `_cash: HTMLButtonElement` - кнопка для выбора способа оплаты: cash;
- `_address: HTMLInputElement` - поле ввода адреса.

Конструктор принимает контейнер с формой и брокер событий. В конструкторе инициализируются защищенные свойства, а также добавляются слушатели на кнопки выбора способа оплаты и инпут адреса.
`constructor(container: HTMLFormElement, events: IEvents)`

Сеттеры:
- `set address(value: string)` -  меняет содержимое поля address в форме;
- `set payment(value: PayMethods)` -  меняет классы кнопок в зависимости от переданного типа оплаты.

Интерфейсы
- `interface IOrderData` - интерфейс данных о способе оплаты и адресе, необходимый для рендера формы.
#### Класс OrderResult
Наследует абстрактный класс `Component`, в качестве дженерика передается интерфейс IOrderResult, реализует окно с подтверждением заказа.
Конструктор принимаетDOM- элемент окна, брокер событий и объект с колбэком. В конструкторе инициализируются защищенные свойства, а также добавляется слушатель на кнопку.
constructor (container: HTMLElement, events: IEvents, actions: ISuccessActions).

Поля
- `_button: HTMLButtonElement` - кнопка "За новыми покупками", при клике на которую окошко закрывается
- `_description: HTMLElement` - DOM-элемент, куда вписывается итоговая сумма заказа


Сеттеры:
- `set total(value: number)` - устанавливает итоговую сумму.
Интерфейсы

- `interface IOrderResult` - интерфейс данных успешного оформления заказа. Содержит итоговую сумму заказа и необходим для рендера.
- `interface IResultActions` - интерфейс, описывающий действия с окном.
### Слой коммуникации

#### Класс AppApi
Наследует класс `Api`
Поля:
- `cdn` - url сервера с контентом.
Принимает в конструктор экземпляр класса Api и представляет методы, реализующие взаимодействие с бэкендом сервиса.

`constructor(cdn: string, baseUrl: string, options?: RequestInit) `
Методы:
- `getItemtList` - возвращает массив товаров с сервера;
- `getItem` - возвращает карточку товара по id;
- `createOrder` - отправляет сформированный заказ на сервер, возвращает результат.

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.
Список всех событий, которые могут генерироваться в системе:

*События изменения данных (генерируются классами моделей данных)*

 - `basket:changed` - изменение массива карточек в корзине;
 - `item:previewClear` - необходима очистка данных выбранной для показа в модальном окне карточки товара;
  
  *События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
   - `item:open` - открытие в модальном окне карточки товара;
   - `basket:delete` - удаление товара из корзины;
   - `basket:add` - добавление товара в корзину;
   - `basket:submit` - оформить заказ;
   - `item:select` - выбор товара и добавление его в корзину;
   - `order:input` - изменение данных в форме с данными пользователя;
   - `order:submit` - сохранение данных пользователя в модальном окне;
   - `order:validation` - событие, сообщающее о необходимости валидации формы заказа;
   - `contacts:input` - изменение данных в форме с контактами пользователя;
   - `contacts:validation` - событие, сообщающее о необходимости валидации формы заказа.
