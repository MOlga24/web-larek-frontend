import { TOrderData, PayMethods, IOrder, IContacts} from "../../types"; 
import  { IOrderData } from "../../types"; 
import { IItemData } from "../../types";
import { IEvents } from "./events";
import { FormOrder } from "../Form_Order";
import { Model } from "./Model";
export class OrderData extends Model<IOrder> {
    order:IOrder={items: [],
   total: 0,
    payment: '',
    address: '',
    email: '',
    phone: '',}
  	
   valid: false;
    errors:{};
   errorMessage = ['поле не может быть пустым', 'необходимо выбрать способ оплаты',
        'необходимо заполнить все поля'];
   
    // setOrderField(field: keyof TOrderData, value: string) {
    //     this.order[field] = value;

    //     if (this.validateOrder()) {
    //         this.events.emit('order:ready', this);
  
    //     }
    // }
    // setContactsField(field: keyof TOrderData, value: string) {
    //         this.order[field] = value;
    //     if (this.validateContacts()){
    //          this.events.emit('contacts:ready', this);
  
    //     }
    // }

    validateOrder(){
        const errors:string[]=[];   console.log(Object.keys(this)) ;
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
