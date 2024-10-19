import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter, IEvents } from "./base/events";

interface IForm {
    value: string;
    buttonText: string;
    errors: string[];
    valid: boolean;
}
export class FormContacts<T> extends Component<IForm>  {
    protected inputPhone: HTMLInputElement;
    protected inputEmail: HTMLInputElement;
    submitButton: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
        this.inputEmail = container.querySelector('#contacts input[name="email"]');
        this.inputPhone = container.querySelector('#contacts input[name="phone"]');
        this.submitButton = ensureElement('.button', this.container) as HTMLButtonElement;
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });
        // this.container.addEventListener('submit', (event) => {
        //     event.preventDefault();
        //     this.events.emit('form:submit', {value: this.inputPhone.value});
        // })
    }
    protected onInputChange(field: keyof T, value: string) {
        // this.events.emit(`${this.container.name}.${String(field)}:change`, {
        //     field,
        //     value
        // });
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
    set buttonText(value: string) {
        this.setText(this.submitButton, value);
    }
    set errors(value: string) {
        this.setText(this.formErrors, value);
    }

    // render(state: Partial<T> & IForm) {
    //     const {valid, errors, ...inputs} = state;
    //     super.render({valid, errors});
    //     Object.assign(this, inputs);
    //     return this.container;

    // }
}
