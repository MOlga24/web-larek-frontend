import { IEvents } from "./events";
import { FormErrors, IContacts } from "../../types";
import { IFormValidation} from "../../types";
import { Model } from "./Model";
import { IItemData, IOrder,  IAppState, TOrderData } from "../../types";
// export type CatalogChangeEvent = {
//    catalog: IItemData[]
// };

export class ItemData extends Model<IItemData>{
  // items: IItemData[] = [];
   id:string;
   title: string;
   category: string;
   image: string;
   price: number;
   description: string;
   selected:boolean;
  // _preview: string | null;
   //index?:number;
//     preview: string;
// status: string;
constructor(data:Partial<IItemData>, protected events:IEvents){
        super(data,events);
    }
   //    setItems(items: IItemData[]){       
   //  items.map((item) => this.items.push(item));
	// 	this.emitChanges('items:changed', { items : this.items });
   //    }

   //   getItems():IItemData[] {
   //     return this.items;
    
   //   }
   //   getItem(id:string):IItemData{
   //      return this.items.find(item => id ===item.id);
        
   //   }
    
//      selectItem(id: string) {
//       const item = this.getItem(id);
//       item.selected = true;
//       console.log(item);
//       this.events.emit('items:changed');
      
//   }
  
    }

    export class AppState extends Model<IAppState> {
     basket: string[];
      catalog: IItemData[]=[];
      loading: boolean;
      order: IOrder= {
          email: '',
          phone: '',
          items:[],
          payment: '',
          address: '',  
          total: 0   
     };
     errors:{};
     valid: true;
        
      preview: string | null; 
       errorMessage = ['поле не может быть пустым', 'необходимо выбрать способ оплаты',
         'необходимо заполнить все поля'];;

        getItem(id:string):IItemData{
        return this.catalog.find(item => id ===item.id);
      }
      selectItem(id: string) {
         const item = this.getItem(id);
         item.selected = true;
         console.log(item);
         this.events.emit('items:changed');
         
     }

     setItems(items: IItemData[]){       
       items.map((item) => this.catalog.push(item));
      	this.emitChanges('items:changed', {items : this.catalog});
         }
      setCatalog(items: IItemData[]) {
        this.catalog = items.map(item => new ItemData(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
      }
     setOrderField(field: keyof TOrderData, value: string) {
    
      this.order[field] = value;

      if (this.validateOrder()) {
          this.events.emit('order:ready', this.order);
      }
  }

     validateOrder() {
      const errors:string[]=[];   
      if(!this.order.address && !this.order.payment){
          errors.push(this.errorMessage[2])
      }
      else
      { if (!this.order.address){        
          errors.push(this.errorMessage[0]); 
      }
      if (!this.order.payment){ 
          errors.push(this.errorMessage[1]); 
      }    
      }   
      this.errors= errors;
      this.events.emit('order:change',this.errors);
      return Object.keys(errors).length === 0;
  
  }
  setPreview(item: IItemData) {
    this.preview = item.id;
   this.emitChanges('preview:changed', item);
}
// getTotal() {
//    return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
// }
getTotalSum(){
   return this.order.items.reduce((partialSum, a) => partialSum + a.price, 0);
}
toggleOrderedItem() {
   this.catalog.forEach((it) => {
      it.selected = false;
   });
}

clearBasket() {
   this.order.items.forEach(id => {
       this.toggleOrderedItem();
       this.order.items = [];
   this.order.total = 0;
      
   });
}
addToBasket(item:IItemData){
   item.selected =true;
   this.order.items.push(item);
   this.order.total = this.getTotalSum();
}
removeFromBasket(item:IItemData){
   item.selected =!true;
  this.order.items = this.order.items.filter((it) => it.id !==item.id);
   this.order.total = this.getTotalSum();
}

setContactsField(field: keyof TOrderData, value: string) {
       this.order[field] = value;
   if (this.validateContacts()){
        this.events.emit('contacts:ready', this);

   }
}

validateContacts(){
   const errors:string[]=[];
   if(!this.order.phone && !this.order.email){
   errors.push(this.errorMessage[2])
   }       
   else
   { if (!this.order.phone){        
   errors.push(this.errorMessage[0]); 
   }
   if (!this.order.email){ 
   errors.push(this.errorMessage[1]); 
   }
   }  
   this.errors= errors;
   this.events.emit('contacts:change',this.errors);
   return Object.keys(errors).length === 0;
}

} 

   
      // formErrors: FormErrors = {};

// getItemInfo(): IItemData{
//     return {
//         items: this.items,
//         total:this.total
//     }
// }
// addItem(item:IItemData){
//     this._items = [item, ...this._items]

// }
// deleteItem(itemId:string, payload: Function | null = null){    
// this._items = this._items.filter(item => item._id!==itemId);

// }
// get preview (){
//     return this. _preview;
// }
// } 