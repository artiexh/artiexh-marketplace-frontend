type User = {
	id: string;
	username: string;
	status: string;
	role: string;
	avatarUrl: string;
	email: string;
};

type Product = {
	id: string;
	name: string;
	price: number;
	description: string;
	released: string;
	tags: string[];
	seller: Seller;
	ratings: number;
};

type Seller = {
	id: string;
	name: string;
	rating: number;
};
