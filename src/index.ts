import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { ItemData } from './components/base/ItemData';
import { OrderData } from './components/base/OrderData';
import { ItemDataApi } from './components/base/ItemDataApi';
import { Basket } from './components/Basket';
import { cloneTemplate } from './utils/utils';
//import { Item } from './components/base/Item';
import { ApiResponse } from './components/base/api';
import { Page } from './components/Page';
import { AppState } from './components/base/ItemData';
import { Modal } from './components/common/Modal';
import { ensureElement } from './utils/utils';
import { CatalogChangeEvent } from './components/base/ItemData';
import { CatalogItem } from './components/Card';
import { IItemData } from './types';
const events = new EventEmitter();
import { Card } from './components/Card';
import { ApiListResponse } from './components/base/api';
import { BasketData } from './components/base/BasketData';
const itemsData = new ItemData({}, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const orderData = new OrderData(events);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
// Модель данных приложения
const appData = new AppState({}, events);
const basketData = new BasketData({},events);
// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);



// console.log(itemsData.getTotal(testItem.items));
// events.on<CatalogChangeEvent>('items:changed', () => {
//     page.catalog = appData.catalog.map(item => {
//         const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
//             onClick: () => events.emit('card:select', item)
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             description: item.description,
//             price: item.price,
//             category: item.category,
//             status: {
//                 status: item.status,
//                  label: item.statusLabel
//             },
//         });
//     });

//     // page.counter = appData.getClosedLots().length;
// });
const api = new ItemDataApi(CDN_URL, API_URL);
const itemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const itemPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
    const basket = new Basket(cloneTemplate(basketTemplate), events);
// api.getItemsList()
// .then(data => {
//     itemsData.setItems(data)
// })
// .catch(err => console.log(err))
const itemElement =document.querySelector('.gallery')as HTMLDListElement




api.getItemsList()
.then(data=>{itemsData.setItems(data)})
// api.get('/api/weblarek/product')
// .then((res:ApiResponse)=>{itemsData.setItems(res.items as IItemData[])}) так тоже работает, только в stImage поменять адрес image
// api.getItemsList()
//     .then(appData.setCatalog.bind(appData) так нет
//     (console.log(appData)))
    
    .catch(err => {
        console.error(err);
    });
    events.on('items:changed', () => {
        page.counter =basketData.items.length;
        //для каждого продукта в модели каталога инстанцируем и рендерим карточку
        page.catalog = itemsData.items.map((item) => {
            const catalogItem = new Card('card', cloneTemplate(itemTemplate), {
               onClick: () => events.emit('card:select', item), 
                // создаем действие открытия карточки из каталога
            }
        );
            return catalogItem.render(item);
        }
       
    );
   
    });
    //  events.on('card:select', (item: ItemData) => {
    //     const ItemPreview = new Card('card',cloneTemplate(itemPreviewTemplate), {
    //         onClick: () => events.emit('preview:changed', item)} )
            
    //        // ItemPreview.render(item);
    //  });
     events.on('card:select', (item: ItemData) => {
        const ItemPreview = new Card('card',cloneTemplate(itemPreviewTemplate), {
                 onClick: () => events.emit('basket:add', item)} )
        modal.render({content:ItemPreview.render(item)});
        
    });
    // Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});
// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
events.on('basket:add', (item:ItemData) => 
    {basketData.items.some((it) => it.id === item.id) ? basketData.removeFromBasket(item): basketData.addToBasket(item);
        page.counter =basketData.items.length;
        basket.items= basketData.items.map((item, num) =>{
            const basketItem = new Card('card', cloneTemplate(basketCardTemplate),
            { onClick: () => events.emit('basket:add', item)})
            
            return basketItem.render(item)});
});
events.on('basket:open', ()=>{
    
       modal.render({content:  basket.render()
	});
    });
       
   

    

       
   


// events.on('auction:changed', () => {
//     page.counter = appData.getClosedLots().length;
//     bids.items = appData.getActiveLots().map(item => {
//         const card = new BidItem(cloneTemplate(cardBasketTemplate), {
//             onClick: () => events.emit('preview:changed', item)
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             status: {
//                 amount: item.price,
//                 status: item.isMyBid
//             }
//         });
//     });
//     let total = 0;
//     basket.items = appData.getClosedLots().map(item => {
//         const card = new BidItem(cloneTemplate(soldTemplate), {
//             onClick: (event) => {
//                 const checkbox = event.target as HTMLInputElement;
//                 appData.toggleOrderedLot(item.id, checkbox.checked);
//                 basket.total = appData.getTotal();
//                 basket.selected = appData.order.items;
//             }
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             status: {
//                 amount: item.price,
//                 status: item.isMyBid
//             }
//         });
//     });
//     basket.selected = appData.order.items;
//     basket.total = total;
// })
//     import { IItemData } from "../../types";
// import { ensureElement } from "../../utils/utils";
// import { Component } from "./Component";
//     export class Item extends Component<IItemData> {
//         protected itemTitle: HTMLElement;
//         protected itemButton:HTMLButtonElement;
//         protected itemDescription: HTMLParagraphElement;
//         protected itemCategory: HTMLSpanElement;
//         protected itemPrice:HTMLSpanElement;
//         protected itemImage:HTMLImageElement;
//         protected items: IItemData[] = [];
//         constructor(container:HTMLElement){
//            super(container)
//            this.itemTitle = ensureElement('.card__title',this.container);
//           // this.itemButton = ensureElement('.gallery__item',this.container) as HTMLButtonElement;
//           // this.itemDescription = ensureElement('.card__text',this.container) as HTMLParagraphElement;
//            this.itemCategory = ensureElement('.card__category',this.container);
//           this.itemPrice=ensureElement('.card__price',this.container);
//           this.itemImage=ensureElement('.card__image',container) as HTMLImageElement;
//         }

//         set title(value:string){
//             this.setText(this.itemTitle,value); 
//         }
//         set category(value:string){
//             this.setText(this.itemCategory,value); 
//         }
//         set price(value:number){
//             this.setText(this.itemPrice,value); 
//         }
//         set image(value:string) {
//             this.setImage(this.itemImage, value, this.title);
//         }
//         set description(value:string){
//             this.setText(this.itemDescription,value); 
//         }
//         // //для переключения способа оплаты => перенести в order
//         // set paymethod(value:boolean) {
//         //     this.toggleClass(this.orderPaymethod,'.button_alt-active',value);
//         //     this.toggleClass(this.orderPaymethod,'.button_alt',!value);
//         // }
//         // render(data:Partial<IItemData>):HTMLElement{
//         //     Object.assign(this as object, data);
//         //     return this.container;
//         // }

//     }
