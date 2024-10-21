import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter, IEvents } from "./base/events";
import { IContacts} from "../types";
import { Form } from "./Form";

export class FormContacts extends Form<IContacts>  {
    protected inputPhone: HTMLInputElement;
    protected inputEmail: HTMLInputElement;
    submitButton: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container,events);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
        this.inputEmail = ensureElement('.form__input[name="email"]',this.container) as HTMLInputElement;
        this.inputPhone = ensureElement('.form__input[name="phone"]',this.container)as HTMLInputElement;
        this.submitButton = ensureElement('.button', this.container) as HTMLButtonElement;
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(`contacts:open`);
        })
        this.inputEmail.addEventListener('input',()=>{
            this.onInputChange('email',this.inputEmail.value)
        })
        this.inputPhone.addEventListener('input',()=>{
            this.onInputChange('phone',this.inputPhone.value)
        })
      
        // this.container.addEventListener('submit', (event) => {
        //     event.preventDefault();
        //     this.events.emit('form:submit', {value: this.inputPhone.value});
        // })
    }

    

    set phone(value: string) {
        this.inputPhone.value = value;
    }
    set email(value: string) {
        this.inputEmail.value = value;
    }
    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
    
}
