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
// import { CatalogChangeEvent } from './components/base/ItemData';
import { Success } from './components/OrderSuccess';
import { IItemData, IOrderData,PayMethods,TOrderData } from './types';
const events = new EventEmitter();
import { Card } from './components/Card';
import { ApiListResponse } from './components/base/api';
import { BasketData } from './components/base/BasketData';
import { FormOrder} from './components/Form_Order';
import { FormContacts } from './components/Form_Contacts';
import { IContacts } from './types'; 
const itemsData = new ItemData({}, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
// const orderData = new OrderData(events);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
// Модель данных приложения
const appData = new AppState({}, events);
const basketData = new BasketData({},events);
// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

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
const formOrderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const formContactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const itemPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formOrder = new FormOrder(cloneTemplate(formOrderTemplate),events);
const formContacts =new FormContacts(cloneTemplate(formContactsTemplate),events);
const itemElement =document.querySelector('.gallery')as HTMLDListElement
const orderData = new OrderData({},events);




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
        
        page.catalog = itemsData.items.map((item) => {
            const catalogItem = new Card('card', cloneTemplate(itemTemplate), {
               onClick: () => events.emit('card:select', item), 
                // создаем действие открытия карточки из каталога
            }
  
        );
        console.log(itemsData);
            return catalogItem.render(item);
        }
       
    );
   
    });
  
     events.on('card:select', (item: ItemData) => {
        const ItemPreview = new Card('card',cloneTemplate(itemPreviewTemplate), {
                 onClick: () => events.emit('basket:add', item)
                } );
               
             if (item.selected == true)  { ItemPreview.buttonText = 'Удалить из корзины'}
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
events.on('basket:add', (item:ItemData) => {
        modal.close();     
        basketData.items.some((it) => it.id === item.id) ? basketData.removeFromBasket(item): basketData.addToBasket(item);
        orderData.order.items.push(item.id)
        basket.total = basketData.getTotalSum() +' '+'синапсов';     
        page.counter =basketData.items.length;
        basket.items= basketData.items.map((item) =>{
            const basketItem = new Card('card', cloneTemplate(basketCardTemplate),
            { onClick: () => events.emit('basket:delete', item)});            
            basketItem.index = basketData.items.indexOf(item)+1;
            return basketItem.render(item)});
});
events.on('basket:open', ()=>{
    if ((basketData.total === 0)||(basketData.items.length === 0)){basket.setDisabled(basket.basketButton, true)
    }
else{
    if (basket.basketButton) {
        basket.setDisabled(basket.basketButton, false);
        basket.basketButton.addEventListener('click', () => {
            events.emit('form:open'); 
        });
    }}
       modal.render({content:  basket.render()});
    });
       
    events.on('basket:delete', (item:IItemData)=>{
        basketData.removeFromBasket(item);
        page.counter =basketData.items.length;
        basket.total = basketData.total +' '+'синапсов'; 
        if (basketData.total === 0){basket.setDisabled(basket.basketButton, true)
        }
    //onClick:() =>events.emit('form:open')
        basket.items= basketData.items.map((item,index) =>{
           
            const basketItem = new Card('card', cloneTemplate(basketCardTemplate),
            { onClick: () => events.emit('basket:delete', item)})
            basketItem.index = basketData.items.indexOf(item)+1;
            
            return basketItem.render(item)});
            
});
   

events.on('form:open',()=>{    
     events.emit('address:change',({field:'address',value:''}));
    onClick:() =>events.emit('contacts:open')
   
    modal.render({content:  formOrder.render(orderData)});
 });


 // выбираем способ оплаты
 events.on('payment:change',(data:{field: keyof TOrderData, value: string})=>{
    orderData.setOrderField(data.field, data.value);
  
 })

events.on('address:change',(data:{field: keyof TOrderData, value: string})=>{
    orderData.setOrderField(data.field, data.value);
 })
 events.on('order:change',(errors)=>{
    if(!Object.keys(errors).length==false){
    formOrder.valid = !Object.keys(errors).length;
   formOrder.errors= Object.values(errors).join('  ');
   formOrder.setDisabled(formOrder.submitButton,true)}
   else {
    formOrder.errors='';
   }


 });
 events.on('order:ready',()=>{
    formOrder.setDisabled(formOrder.submitButton,false);
    formOrder.submitButton.addEventListener('click',event=>{ event.preventDefault();
        events.emit('contacts:open')})
 })
 events.on('contacts:open', ()=>{
    events.emit('email:change',({field:'email',value:''}));
    modal.render({content:  formContacts.render(orderData)});
 }); 


 events.on('email:change',(data:{field: keyof TOrderData, value: string})=>{
    orderData.setContactsField(data.field, data.value);
   
  })

 events.on('phone:change',(data:{field: keyof TOrderData, value: string})=>{
    orderData.setContactsField(data.field, data.value);
  })
  events.on('contacts:ready',()=>{
    formContacts.setDisabled(formContacts.submitButton,false);
    formContacts.submitButton.addEventListener('click',event=>{ event.preventDefault();
        events.emit('order:submit')})
 })
 events.on('contacts:change',(errors)=>{
    if(!Object.keys(errors).length==false){
    formOrder.valid = !Object.keys(errors).length;

    formContacts.errors= Object.values(errors).join('');
   formContacts.setDisabled(formContacts.submitButton,true)}
   else {
    formContacts.errors ='';
   }


 });

// Отправлена форма заказа
events.on('order:submit', () => {    
   
    orderData.order.total = basketData.getTotalSum()
    api.orderItems(orderData.order)
.then(result=>{
    const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    itemsData.items.forEach(it=>{it.selected = false})
                    basketData.clearBasket();
                    basket.items=[];
                    basket.total='';
                    events.emit('items:changed');
                }              
            });
          success.total = basketData.total;
            modal.render({
                content: success.render({})
            });
         })    
    .catch(err => {
        console.error(err);
    });    
            
        })
        
   
  




