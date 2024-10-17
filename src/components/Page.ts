import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected pagecounter: HTMLElement;
    protected pagecatalog: HTMLElement;
    protected pagewrapper: HTMLElement;
    protected pagebasket: HTMLElement;
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.pagecounter = ensureElement<HTMLElement>('.header__basket-counter');
        this.pagecatalog = ensureElement<HTMLElement>('.gallery');
        this.pagewrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.pagebasket = ensureElement<HTMLElement>('.header__basket');

        this.pagebasket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this.pagecounter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this.pagecatalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this.pagewrapper.classList.add('page__wrapper_locked');
        } else {
            this.pagewrapper.classList.remove('page__wrapper_locked');
        }
    }
}