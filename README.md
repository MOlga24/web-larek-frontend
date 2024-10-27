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
 interface IItemData {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	selected: boolean;
}
```
Интерфейс модели данных
```
interface IAppState {
	catalog: IItemData[];
	preview: string | null;
	order: IOrder | null;
	errors: {};
	valid: boolean;
}
```
Тип метода платежа
```
 type PayMethods = 'card' | 'cash';
```
Интерфейс контактов пользователя
```
interface IContacts {
	email: string;
	phone: string;
}
```
Интерфейс заказа
```
 interface IOrder {
	items: IItemData[];
	total: number | null;
	payment: string;
	address: string;
	email: string;
	phone: string;
}
```
Интерфейс деталей заказа
```
interface IOrderData {
	address: string;
	payment: string;
	email: string;
	phone: string;
	items: string[];
}
```
Интерфейс проверки формы заказа
```
interface IFormValidation {
	valid: boolean;

}
```
Интерфейс полученного заказа
```
 interface IOrderResult {
    total: number;
}
```

```
Интерфейс АПИ(получение данных)
```
 interface IItemAPI {
    getItemsList: () => Promise<IItemData[]>;
	orderItems: (order: IOrderData) => Promise<IOrderResult>;
}
```
Типы для модальных окон: платеж и адрес, почта и телефон
```
 type TPayInfo = Pick<IOrderData, 'address' | 'paymethod'>;
 type TOrderInfo = Pick<IOrderData, 'email' | 'phone'>;
 type TOrderData = TPayInfo & TOrderInfo;
 type FormErrors = Partial<Record<keyof IOrder, string>>; 

```
Интерфейс успешного заказа
```
interface ISuccess {
	total: number;
}
```
Интерфейс действия с окном заказа
```
interface ISuccessActions {
	onClick: () => void;
}
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
	items: HTMLElement[];
    total: number;   
}
```
Отображение для карточек товара
```
interface ICard<T> {
	title: string;
	image: string;
	description: string;
	category: string;
	price: number;
	buttonText: string;
	id: string;
}
```
Отображение модального окна
```
interface IModalData {
    content: HTMLElement;
}
```
Тип ошибок формы
```
 type FormErrors = Partial<Record<keyof IOrder, string>>;
```
Отображение для формы заказа
```
interface IFormOrder {
	new (container: HTMLElement, events?: IEvents): IView;
}



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


#### Класс AppState 
Наследует абстрактный класс Model.
Класс отвечает за хранение и логику работы с данными заказа текущего пользователя.\
 В полях класса хранятся следующие данные:
- `catalog: []` - карточки товаров.
- `order: {
	- `items: [] ` - товары в корзине,
	- `adress:string` - адрес пользователя;
	- `email:string` - почта пользователя;
	- `phone:string` - телефон пользователя;
	- `paymethod:PayMethods` - выбранный пользователем способ оплаты;
 }` 
- данные с полей форм, сумма заказа и товары из корзины.

- `errors: {}` - ошибки валидации.
- `valid` - валидность форм данных для заказа.
Методы:
- `setItems()` -  добавить товары в каталог;
- `setOrderField()` - добавить данные с формы в заказ;
- `setContactsField()` - добавить данные с формы контактов в заказ;
- `removeOrderData()` - очистить данные заказа;
- `validateContacts()` - проверка, что поля контактов не пустые;
- `validateOrder()` - проверка, что поле адреса не пустое, и что выбран способ оплаты;
- `setPreview()` - просмотреть выбранную карточку;
- `getTotalSum()` - найти общую сумму товаров в заказе;
- `toggleOrderedItem() ` - удалить метку добавленной в заказ карточки;
- `clearOrder()` - очистить данные заказа;
- `clearBasket()` - очистить корзину и сумму заказа;
- `addToBasket()` - добавить товар в корзину;
- `removeFromBasket()` - удалить из корзины.

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
Реализует отображение формы. Наследует абстрактный класс `Component`.\
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
- `showInputError(value: string)` - отображает ошибки валидации;
- `hideInputError() ` - скрывает ошибки валидации;
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
- `render(data: IModalData): HTMLElement` - рендерит модальное окно с переданным содержимым и открывает его.\
Интерфейс данных, которые передаются в модальное окно:\
`interface IModalData`


#### Класс Page
Наследует класс `Component` и  реализует главную страницу проекта - каталог товаров с корзиной и счетчиком. В конструктор принимает DOM- элемент главной страницы и брокер событий.
  ` constructor(container: HTMLElement, protected events: IEvents)`

Поля:
- `pageCounter: HTMLElement` - DOM-элемент, в котором будет отображаться количество товаров в корзине;
- `pageCatalog: HTMLElement` - DOM-элемент для отображения каталога товаров;
- `pageWrapper` - DOM-элемент обертки на странице для того, чтобы заблокировать прокрутку страницы;
- `pageBasket: HTMLElement` - DOM-элемент для отображения корзины.
Сеттеры:
- `set counter(value: number)`- меняет значение счетчика на полученное;
- `set catalog(items: HTMLElement[])` - меняет содержимое каталога;
- `set locked(value: boolean) ` - меняет класс обертки страницы на полученное значение.
#### Класс Card
Наследует класс `Component` и  реализует карточку товара. В конструктор принимает шаблонное имя блока, DOM- элемент карточки и объект с колбэком при клике (необязательный)
  ` constructor(protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions)`

Поля:
- `сardTitle: HTMLElement` - DOM-элемент названия карточки;
- `cardImage?: HTMLImageElement` - DOM-элемент для изображения товара;
- `cardDescription: HTMLParagraphElement` - DOM-элемент описания товара;
- `cardCategory?: HTMLSpanElement` - DOM-элемент категории товара;
- `cardButton?: HTMLButtonElement` - DOM-элемент кнопки добавления карточки в корзину;
- `cardItemButton?: HTMLElement` - DOM-элемент кнопки удаления карточки из корзины;
- `basketItemIndex?: HTMLSpanElement` - DOM-элемент для нумерации;\

Сеттеры:
- `id`- задает id карточки;
- `title`- задает название карточки;
- `description`- задает описание карточки;
- `category`- задает категорию карточки;
- `index`- задает индекс в списке корзины;
- `buttonText`- задает текст кнопки;
Геттеры:
- `id`- получает id карточки;
- `title`- получает название карточки;

#### Класс Basket
Класс  является расширением класса `Component`.
Отвечает за отображение корзины.

В конструктор принимает контейнер с HTML - элементами и брокер событий.\
`constructor(container: HTMLElement, events: EventEmitter) {}`\
Поля:
- `basketList:  HTMLElement` - элемент содержимого корзины (карточек товаров);
- `basketTotal:  HTMLElement` - элемента стоимости корзины;
- `basketButton: HTMLElement`- элемент конпки оформления заказа.

Сеттеры:
- `set total(price: number)` - меняет занчение общей суммы в заказе;
- `set items(items: HTMLElement[])` - меняет содержимое в корзине.
Методы:
- `toggleButton(value:boolean) ` - меняет доступность кнопки оформления;
- `setHidden()` - скрывает итоговую цену, если ее нет.

#### Класс FormContacts
Наследует класс `Form`, в качестве дженерика передается интерфейс `IContacts`.
Отвечает за отображение формы, содержащей информацию о контактах пользователя:  почта, телефон.\
Конструктор класс в качестве аргументов принимает контейнерс формой и брокер событий. В конструкторе инициализируются защищенные свойства, а также добавляются слушатели инпуты.

`constructor(container: HTMLFormElement, events: IEvents)`\
Поля

- `inputEmail: HTMLInputElement` - DOM-элемент инпута почты;
- `inputPhone: HTMLInputElement` - DOM-элемент инпута телефона.


Сеттеры:

- `set email(value: string)` - сеттер для почты;
- `set phone(value: string)` - сеттер для телефона.

Типы и интерфейсы:

`interface IContacts` - интерфейс данных о контактах юзера, неоюходимый для рендера формы.

#### Класс FormOrder
Наследует абстрактный класс Form, в качестве дженерика передается интерфейс `IOrderData`. Отвечает за отображение формы, содержащей информацию о деталях доставки: адрес и способ оплаты.

Поля

- `cardButton: HTMLButtonElement` - кнопка для выбора способа оплаты: card;
- `cashButton: HTMLButtonElement` - кнопка для выбора способа оплаты: cash;
- `orderAdress: HTMLInputElement` - поле ввода адреса.

Конструктор принимает контейнер с формой и брокер событий. В конструкторе инициализируются защищенные свойства, а также добавляются слушатели на кнопки выбора способа оплаты и инпут адреса.
`constructor(container: HTMLFormElement, events: IEvents)`

Сеттеры:
- `set address(value: string)` -  меняет содержимое поля address в форме;
- `set payment(value: PayMethods)` -  меняет классы кнопок в зависимости от переданного типа оплаты.

Типы:
- `тип TPayInfo` - тип данных,необходимый для рендера формы.

#### Класс OrderSuccess
Наследует абстрактный класс `Component`, в качестве дженерика передается интерфейс ISuccess, реализует окно с подтверждением заказа.
Конструктор принимает DOM- элемент окна, брокер событий и объект с колбэком. В конструкторе инициализируются защищенные свойства, а также добавляется слушатель на кнопку.
constructor (container: HTMLElement, events: IEvents, actions: ISuccessActions).

Поля
- `_close: HTMLButtonElement` - кнопка "За новыми покупками", при клике на которую окошко закрывается;
- `totalSum: HTMLElement` - DOM-элемент, куда вписывается итоговая сумма заказа.


Сеттеры:
- `set total(value: number)` - устанавливает итоговую сумму.
Интерфейсы

- `interface ISuccess` - интерфейс данных успешного оформления заказа. Содержит итоговую сумму заказа и необходим для рендера.
- `interface IResultActions` - интерфейс, описывающий действия с окном.

### Слой коммуникации

#### Класс ItemDataApi
Наследует класс `Api`
Поля:
- `cdn` - url сервера с контентом.
Принимает в конструктор экземпляр класса Api и представляет методы, реализующие взаимодействие с бэкендом сервиса.

`constructor(cdn: string, baseUrl: string, options?: RequestInit) `
Методы:
- `getItemtList` - возвращает массив товаров с сервера;
- `orderItems` - отправляет сформированный заказ на сервер, возвращает результат.
Интерфейсы:
 - `interface IDataAPI {
    getItemsList: () => Promise<IItemData[]>;
    orderItems: (order: IOrderData) => Promise<IOrderResult>;` - интерфейс получения товаров с сервера и отправки заказа на сервер.
}

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.
Список всех событий, которые могут генерироваться в системе:
  
  *События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
   - `catalog:changed` - изменение каталога;
   - `card:select` - выбор товара в каталоге;
   - `preview:changed` - открытие в модальном окне карточки товара;
   - `basket:open` - открытие корзины;  
   - `basket:delete` - удаление товара из корзины;
   - `basket:add` - добавление товара в корзину;
   - `modal:open` - открытие модального окна;
   - `modal:close` - закрытие модального окна;
   - `form_order:open` - открытие формы с платежом и адресом;
   - `order:change` - изменение данных формы с выбором оплаты и адреса;
   - `form_order:ready` - форма с платежом и адресом валидна;
   - `form_contacts:ready` - форма контактов валидна;
   - `contacts:change` - изменение данных в форме с контактами пользователя;
   - `contacts:submit` - сабмит формы контактов.
