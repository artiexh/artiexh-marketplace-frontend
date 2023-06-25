export type FilterProps = {
	categoryId: string;
	cost_gte: number;
	cost_lte: number;
	ratings_gte: number;
	locations: number[]; // Temp: no way to make this work with JSONSERVER, i dont want to code BE
};

export type PaginationProps = {
	_page: number;
	_limit: number;
	_sort: string;
	_order: 'asc' | 'desc';
};
