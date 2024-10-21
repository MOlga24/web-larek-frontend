import { TOrderData, PayMethods, IOrder, IContacts} from "../../types"; 
import  { IOrderData } from "../../types"; 
import { IEvents } from "./events";
import { FormOrder } from "../Form_Order";
import { Model } from "./Model";
export class OrderData extends Model<IOrder> {
  	items: string[]=[];
   total: number | null=null;
  payment: string;
     adress: string ='';
    email: string ='';
     phone: string ='';
    valid: boolean = false;


errors: Partial<Record<keyof (IOrderData&IContacts), string>>={};
    errorMessage = 'поле не может быть пустым';
    // getOrderInfo(): TOrderData{
    //     return {
    //         // items: this.items,
    //         // total:this.total
    //     }
    // }
    setOrderField(field: keyof TOrderData, value: string) {
        this[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this);
  
        }
    }
        setContactsField(field: keyof TOrderData, value: string) {
            this[field] = value;
        if (this.validateContacts()){
            this.events.emit('contacts:ready', this);
  
        }
    }

validateOrder(){
    const errors: typeof this.errors ={};
    if (!this.adress){
        errors.adress='поле не может быть пустым'
    }
    if (!this.payment){
        errors.payment='необходимо выбрать способ оплаты'
    }
    
    this.errors= errors;
    this.events.emit('order:change',this.errors);
    return Object.keys(errors).length === 0;
}

validateContacts(){
    const errors: typeof this.errors ={};
  
    
    if (!this.phone){
        errors.phone='поле не может быть пустым'
    }
    if (!this.email){
        errors.email='поле не может быть пустым'
    }
    this.errors= errors;
    this.events.emit('contacts:change',this.errors);
    return Object.keys(errors).length === 0;
}

}
