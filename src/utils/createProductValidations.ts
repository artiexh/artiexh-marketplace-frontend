import { CreateProductValues } from '@/types/Product';
import { FormValidateInput } from '@mantine/form/lib/types';

export function validationHandler(valid: boolean, error: string) {
	return valid ? null : error;
}

export const createProductValidation: FormValidateInput<CreateProductValues> = {
	// general
	name: (name) => {
		if (name.trim().length === 0) return 'Name is required';
		if (name.trim().length < 5) return 'Name must be at least 5 characters';
		if (name.trim().length > 50) return 'Name cannot be longer than 50 characters';
		return null;
	},
	category: (category) => validationHandler(category !== null, 'Category is required'),
	price: {
		value: (value) => validationHandler(value > 0, 'Price must be greater than 0'),
	},
	// attaches: (attaches) =>
	// 	mantineValidationHandler(attaches.length > 0, 'At least 1 image is required'),
	remainingQuantity: (remaining) => {
		if (typeof remaining === 'string') return 'Remaining quantity is required';
		if (remaining < 0) return 'Remaining quantity must be at least 0';
		return null;
	},
	maxItemsPerOrder: (maxItems) => {
		if (typeof maxItems === 'string') return 'Max items per order is required';
		if (maxItems < 0) return 'Max items per order must be at least 0';
		return null;
	},
	thumbnail: (thumbnail) => {
		if (thumbnail.trim().length === 0) return 'Thumbnail is required';
		return null;
	},

	// pre-order
	publishDatetime: (publishDate, formValues) => {
		if (!formValues.allowPreOrder) return null;
		if (!publishDate) return 'Publish date is required';
		if (publishDate.getTime() < Date.now()) return 'Publish date must be in the future';
		if (
			!!formValues.preOrderRange[1] &&
			publishDate.getTime() < formValues.preOrderRange[1].getTime()
		)
			return 'Publish date must be after preorder ended';
		return null;
	},
	preOrderRange: (preOrderDates, formValues) => {
		if (!formValues.allowPreOrder) return null;
		if (!preOrderDates[0]) return 'Preorder start date is required';
		if (!preOrderDates[1]) return 'Preorder end date is required';
		// Not gonna happen since mantine handles this
		// if (preOrderDates[0].getTime() > preOrderDates[1].getTime())
		// return 'Preorder start date must be before preorder end date';
		if (!!formValues.publishDatetime && preOrderDates[1].getTime() < Date.now())
			return 'Preorder end date must be in the future';
		// Make sure pre-order end date is before or on publish date
		if (
			!!formValues.publishDatetime &&
			preOrderDates[1].getTime() > formValues.publishDatetime.getTime()
		)
			return 'Preorder end date must be before or on publish date';
		return null;
	},
	// delivery
	pickupLocation: (location, formValues) => {
		if (formValues.allowShipping) return null;
		if (!location) return 'Pickup location is required';
		if (location.trim().length < 5) return 'Pickup location is too short';
		return null;
	},

	// payment
	paymentMethods: (methods) =>
		validationHandler(methods.length > 0, 'At least 1 payment method is required'),
};

export const CURRENCIES = ['USD', 'VND', 'EUR', 'YEN'];

export const DEFAULT_FORM_VALUES: CreateProductValues = {
	// general
	name: '',
	category: null,
	// memberOnly: false,
	tags: [],
	description: '',
	price: {
		value: 1,
		unit: CURRENCIES[0],
	},
	thumbnail: '',
	attaches: [],
	maxItemsPerOrder: 0, // 0 = unlimited
	remainingQuantity: 0,
	// pre-order
	allowPreOrder: false,
	publishDatetime: null,
	preOrderRange: [null, null],
	// shipping
	allowShipping: false,
	pickupLocation: '',
	sameAsStoreAddress: false,
	// payment
	paymentMethods: [],
};
