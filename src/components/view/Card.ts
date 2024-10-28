import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { categoryName } from '../../utils/constants';
interface ICardActions {
	onClick: () => void;
}

export interface ICard<T> {
	title: string;
	image: string;
	description: string;
	category: string;
	price: number;
	buttonText: string;
	id: string;
}

export class Card<T> extends Component<ICard<T>> {
	protected сardTitle: HTMLElement;
	protected cardImage?: HTMLImageElement;
	protected cardDescription: HTMLParagraphElement;
	protected cardCategory?: HTMLSpanElement;
	protected cardPrice: HTMLSpanElement;
	protected cardButton?: HTMLButtonElement;
	protected cardItemButton?: HTMLElement;
	protected basketItemIndex?: HTMLSpanElement;
	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this.сardTitle = ensureElement<HTMLElement>(
			`.${blockName}__title`,
			container
		);
		this.cardImage = container.querySelector(`.${blockName}__image`);
		this.cardButton = container.querySelector(`.${blockName}__button`);
		this.cardDescription = container.querySelector(`.${blockName}__text`);
		this.cardCategory = container.querySelector(`.${blockName}__category`);
		this.cardPrice = ensureElement<HTMLSpanElement>(
			`.${blockName}__price`,
			container
		);
		this.basketItemIndex = this.container.querySelector('.basket__item-index');
		if (actions?.onClick) {
			if (this.cardButton) {
				this.cardButton.addEventListener('click', actions.onClick);
			} else {
				this.container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this.сardTitle, value);
	}

	get title(): string {
		return this.сardTitle.textContent || '';
	}

	set image(value: string) {
		this.setImage(this.cardImage, value, this.title);
	}
	// set image(value: string) {
	//     this.setImage(this._image,  CDN_URL + value, this.title)
	// }
	set description(value: string) {
		this.setText(this.cardDescription, value);
	}

	set price(value: string) {
		this.setText(this.cardPrice, value + ' ' + 'синапсов');
		if (value == '0') {
			this.setText(this.cardPrice, 'бесценно');
		}
	}
	set category(value: string) {
		this.setText(this.cardCategory, value);
		if (this.cardCategory) {
			if (value in Object(categoryName)) {
				this.toggleClass(this.cardCategory, Object(categoryName)[value], true);
			}
		}
	}
	set index(value: number) {
		this.setText(this.basketItemIndex, value);
	}
	set buttonText(value: string) {
		this.cardButton.textContent = value;
	}
}
