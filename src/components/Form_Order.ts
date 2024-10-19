import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter, IEvents } from "./base/events";

interface IForm {
    value: string;
    buttonText: string;
    errors: string[];
    valid: boolean;
}
export class FormOrder<T> extends Component<IForm>  {
    protected cashButton: HTMLButtonElement;
    protected cardButton: HTMLButtonElement;
    protected inputField: HTMLInputElement;
     submitButton: HTMLButtonElement;
    protected formErrors: HTMLElement;
    protected payMethod:HTMLButtonElement;
    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
        this.inputField = ensureElement('.form__input', this.container) as HTMLInputElement;
        this.submitButton = ensureElement('.order__button', this.container) as HTMLButtonElement;
        this.payMethod = container.querySelector('.button_alt');
        this.cardButton = container.querySelector('#order button[name="card"]');
        this.cashButton = container.querySelector('#order button[name="cash"]');
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });
        // this.container.addEventListener('submit', (event) => {
        //     event.preventDefault();
        //     this.events.emit('contacts:open', {value: this.inputField.value});
        // })
    }
    protected onInputChange(field: keyof T, value: string) {
        // this.events.emit(`${this.container.name}.${String(field)}:change`, {
        //     field,
        //     value
        // });
    }

    set value(value: string) {
        this.inputField.value = value;
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
