import { IEvents } from "./events";
import { FormErrors } from "../../types";
import { PayMethods } from "../../types";
import { Model } from "./Model";
import { IItemData, IOrder,  IAppState } from "../../types";
export type CatalogChangeEvent = {
   catalog: IItemData[]
};
export class ItemData extends Model<IItemData>{
  items: IItemData[] = [];
  id:string;
   
//     preview: string;

    title: string;
    category: string;
     image: string;
   price: number;
// status: string;
     description: string;
  // _preview: string | null;

constructor(data:Partial<IItemData>, protected events:IEvents){
        super(data,events);
    }
   // set (id:string, value:boolean){const u = this.getItem(id);
    
   // (u.selected == value)}
      setItems(items: IItemData[]){       
    items.map((item) => this.items.push(item));
		this.emitChanges('items:changed', { items : this.items });
      }

     getItems(item:IItemData[]):IItemData[] {
       return this.items;
    
     }
     getItem(id:string):IItemData{
        return this.items.find(item => id ===item.id);
        
     }
//      selectItem(id:string){
//        const item = this.getItem(id);
//        item.selected = !item.selected;
//   }
     getTotal(){
        // return this.items.length;
     }
     selectItem(id: string) {
      const item = this.getItem(id);
      item.selected = true;
      console.log(item);
      this.events.emit('items:changed');
      
  }
//   getSelected(){const sel = [];
// const itemSelected =sel.concat(this.items.filter(item => item.selected === true ));



// console.log(itemSelected);
// return itemSelected;
//   }
    // get statusLabel(){
    //   this.events.emit('status:changed');
    //   switch (this.status) { 
    //       case "selected":
    //           return `добавлено в корзину`
    //         case "not selected":
    //           return `удалено из корзины`
          
    //       default:
    //           return this.status;
    //   }
      

  // }
  
    }

    export class AppState extends Model<IAppState> {
      basket: string[];
      catalog: ItemData[]=[];
      loading: boolean;
      order: IOrder = {
          email: '',
          phone: '',
          items: [],
          payment: 'card',
          adress: '',
          valid: true,
         //  errors: 'adress','email';
       
      };
      preview: string | null;
      formErrors: FormErrors = {};
      setCatalog(items: IItemData[]) {
         this.catalog = items.map(item => new ItemData(item, this.events));
         this.emitChanges('items:changed', { catalog: this.catalog });
     }
     validateOrder() {
      const errors: typeof this.formErrors = {};
      if (!this.order.adress) {
         errors.adress = 'Необходимо указать email';
     }
      if (!this.order.email) {
          errors.email = 'Необходимо указать email';
      }
      if (!this.order.phone) {
          errors.phone = 'Необходимо указать телефон';
      }
      this.formErrors = errors;
      this.events.emit('formErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
  }
  setPreview(item: ItemData) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
}
} 

   
      // formErrors: FormErrors = {};
// get items (){
//     return this._items;
// }
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