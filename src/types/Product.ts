import { User } from './User';

export type Tag = {
	name: string;
	description: string;
	color: string;
};

export type ArtistInfo = User & {
	rating: number;
};

export type Product = {
	id: string;
	name: string;
	price: Price;
	description: string;
	tags: string[];
	artistInfo: ArtistInfo;
	ratings: number;
	attaches: Attaches[];
	status: 'DELETE' | 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN';
	type: 'NORMAL' | 'PRE_ORDER';
	remainingQuantity: number;
	publishDatetime: string; // ISO String
	preOrderRange?: string[]; // ISO Strings
	maxItemsPerOrder: number;
	allowDelivery: boolean;
	paymentMethods: PaymentMethod[];
	category: Category;
};

export type Attaches = {
	id: string;
	url: string;
	type: 'THUMBNAIL' | 'IMAGE' | 'VIDEO';
	title: string;
	description?: string;
};

export type PaymentMethod = {
	id: string;
	type: string;
};

export type Price = {
	value: number;
	unit: string;
};

export type Category = {
	id: string;
	name: string;
};

export type CreateProductValues = {
	name: string;
	category: string | null;
	// memberOnly: boolean;
	tags: string[];
	description: string;
	price: Price;
	attaches: Attaches[];
	maxItemsPerOrder: number;
	remainingQuantity: number;
	// pre-order
	allowPreOrder: boolean;
	publishDatetime: Date | null;
	preOrderRange: (Date | null)[];
	// shipping
	allowShipping: boolean;
	pickupLocation: string;
	sameAsStoreAddress: boolean;
	// payment
	paymentMethods: string[];
};
