export type Tag = {
	name: string;
	description: string;
	color: string;
};

export type Seller = {
	id: string;
	name: string;
	rating: number;
};

export type Product = {
	id: string;
	name: string;
	price: Price;
	description: string;
	released: string;
	tags: string[];
	shop: Seller;
	ratings: number;
	images: string[];
};

export type Price = {
	value: number;
	unit: string;
};
