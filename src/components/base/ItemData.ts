import { IEvents } from "./events";
import { FormErrors, IContacts } from "../../types";
import { PayMethods } from "../../types";
import { Model } from "./Model";
import { IItemData, IOrder,  IAppState, TOrderData } from "../../types";
export type CatalogChangeEvent = {
   catalog: IItemData[]
};
export class ItemData extends Model<IItemData>{
  items: IItemData[] = [];
  id:string;
   index?:number;
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

  
    }

    export class AppState extends Model<IAppState> {
      basket: string[];
      catalog: ItemData[]=[];
      loading: boolean;
      order: IOrder = {
          email: '',
          phone: '',
     // items: [],
    //    payment: undefined,
          adress: '',
  //        valid: true,
   //     errors:{},
    //  total: 0}
    //  modalMessage: string | null = null;
     
     // preview: string | null;
     // formErrors: FormErrors = {};
     // setCatalog(items: IItemData[]) {
        // this.catalog = items.map(item => new ItemData(item, this.events));
        // this.emitChanges('items:changed', { catalog: this.catalog });
     }
  //    setOrderField(field: keyof TOrderData, value: string) {
    
  //     this.order[field] = value;

  //     if (this.validateOrder()) {
  //         this.events.emit('order:ready', this.order);
  //     }
  // }

  //    validateOrder() {
  //     const errors: typeof this.formErrors = {};
  //     if (!this.order.adress) {
  //        errors.adress = 'Необходимо указать адрес';
  //    }
  //     if (!this.order.email) {
  //         errors.email = 'Необходимо указать email';
  //     }
  //     if (!this.order.phone) {
  //         errors.phone = 'Необходимо указать телефон';
  //     }
  //     this.formErrors = errors;
  //     this.events.emit('formErrors:change', this.formErrors);
  //     return Object.keys(errors).length === 0;
  // }
  //setPreview(item: ItemData) {
    //this.preview = item.id;
   // this.emitChanges('preview:changed', item);
//}
//setMessage(message: string | null, isError = false): void {
 // this.modalMessage = message;
  //this.order.valid = isError;
 // this.notifyChanged(AppStateChanges.modalMessage);
//}


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