import { CreateProductValues } from '@/types/Product';
import { FormValidateInput } from '@mantine/form/lib/types';

export function mantineValidationHandler(valid: boolean, error: string) {
	return valid ? null : error;
}

export const createProductValidation: FormValidateInput<CreateProductValues> = {
	// general
	name: (name) => mantineValidationHandler(name.trim().length > 0, 'Name is required'),
	category: (category) => mantineValidationHandler(category !== null, 'Category is required'),
	price: {
		value: (value) => mantineValidationHandler(value > 0, 'Price must be greater than 0'),
	},
	// attaches: (attaches) =>
	// 	mantineValidationHandler(attaches.length > 0, 'At least 1 image is required'),
	remainingQuantity: (remaining) =>
		mantineValidationHandler(typeof remaining !== 'string' && remaining >= 0, 'Must be at least 0'),
	maxItemsPerOrder: (maxItems) =>
		mantineValidationHandler(typeof maxItems !== 'string' && maxItems >= 0, 'Must be at least 0'),

	// pre-order
	publishDatetime: (publishDate, formValues) =>
		mantineValidationHandler(
			!formValues.allowPreOrder ||
				(!!publishDate &&
					!!formValues.preOrderRange[0] &&
					!!formValues.preOrderRange[1] &&
					publishDate.getTime() >= Date.now() &&
					publishDate.getTime() >= formValues.preOrderRange[1].getTime()),
			'Publish date must be in the future'
		),
	preOrderRange: (preOrderDates, formValues) =>
		mantineValidationHandler(
			!formValues.allowPreOrder ||
				// Pre order start from today
				(!!preOrderDates[0] &&
					!!preOrderDates[1] &&
					!!formValues.publishDatetime &&
					preOrderDates[0].getTime() >= Date.now() &&
					// Pre order end after start
					preOrderDates[0].getTime() < preOrderDates[1].getTime() &&
					// Pre order end before publish
					preOrderDates[1].getTime() <= formValues.publishDatetime.getTime()),
			'Pre order range is invalid'
		),
	// delivery
	pickupLocation: (location, formValues) =>
		mantineValidationHandler(
			formValues.allowShipping || location.trim().length > 0,
			'Pickup location is required'
		),

	// payment
	paymentMethods: (methods) =>
		mantineValidationHandler(methods.length > 0, 'At least 1 payment method is required'),
};
