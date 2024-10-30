import { IItemData, IOrderData, IOrderResult } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IDataAPI {
	getItemsList: () => Promise<IItemData[]>;
	orderItems: (order: IOrderData) => Promise<IOrderResult>;
}

export class ItemDataApi extends Api implements IDataAPI {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItemsList(): Promise<IItemData[]> {
		return this.get('/product').then((data: ApiListResponse<IItemData>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderItems(order: IOrderData): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
