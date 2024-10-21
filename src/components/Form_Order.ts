import { ensureElement } from "../utils/utils";
import { EventEmitter, IEvents } from "./base/events";
import { Form } from "./Form";
import { IOrderData, PayMethods } from "../types";


export class FormOrder extends Form<IOrderData>  {
    protected cashButton: HTMLButtonElement;
    protected cardButton: HTMLButtonElement;
    protected orderAdress: HTMLInputElement;
    submitButton: HTMLButtonElement;
    protected formErrors:HTMLElement;
    protected orderForm:HTMLFormElement;
//    protected payMethod:HTMLButtonElement;
    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container,events);
        this.orderForm = this.container.querySelector('.form');
       this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
        this.orderAdress= ensureElement('.form__input', this.container) as HTMLInputElement;
        this.submitButton = ensureElement('.order__button', this.container) as HTMLButtonElement;
        // this.payMethod = container.querySelector('.button_alt');
        this.cardButton =  ensureElement('.button_alt[name=card]', this.container)as HTMLButtonElement;
        this.cashButton = ensureElement('.button_alt[name=cash]', this.container)as HTMLButtonElement;
        
        // this.container.addEventListener('submit', (event) => {
        //     event.preventDefault();
        //     this.events.emit(`contacts:open`);
        // })
        this.orderAdress.addEventListener('input',()=>{
            this.onInputChange('adress',this.orderAdress.value)
        })
        this.cardButton.addEventListener('click',()=>{
            this.payment = 'card';
            this.onInputChange('payment','card')
        })
        this.cashButton.addEventListener('click',()=>{
            this.payment = 'cash'
            this.onInputChange('payment','cash')
        })
    }
  

    set adress(value: string) {
        this.orderAdress.value = value;
    }
    set valid(value: boolean) {
        // if (value == false) {this.hideInputError(this.errors)}
        //this.submitButton.disabled = value;
    }
    set payment(value:PayMethods){
        this.cardButton.classList.toggle('button_alt-active',value ==='card');
        this.cashButton.classList.toggle('button_alt-active',value ==='cash');
    }
     set error(data:{field:string, value: string,errorMessage:string}) {
        if(data.errorMessage){
            this.showInputError(data.field,data.errorMessage)}
            else{this.hideInputError(data.field);
    
            }
        }
        showInputError(field:string,errorMessage:string){
            this._errors.textContent = 'поле не может быть пустым';
    
        }
    hideInputError(field:string){
        this._errors.textContent  = '';

   }
 
//     close(){
//         this.orderForm.reset();
//       this.hideInputError(this.orderAdress.value);
//     }
    //     this.setText(this.formErrors, value);
    // }
    // set orderPhone(value: string) {
    //     (this.container.phone = value);
    // }
    
    // set orderEmail(value: string) {
    //     this.email = value;
    // }
    // render(state: Partial<T> & IFormState) {
    //     const {valid, errors, ...inputs} = state;
    //     super.render({valid, errors});
    //     Object.assign(this, inputs);
    //     return this.container;

    // }
}
