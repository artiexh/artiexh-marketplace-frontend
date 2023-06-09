import useCategories from '@/hooks/useCategories';
import { CreateProductValues } from '@/types/Product';
import {
	DEFAULT_FORM_VALUES,
	createProductValidation,
	CURRENCIES,
} from '@/utils/createProductValidations';
import {
	Button,
	Checkbox,
	Input,
	MultiSelect,
	NumberInput,
	Select,
	Switch,
	TextInput,
	Textarea,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import clsx from 'clsx';
import { useState } from 'react';

const CreateProductContainer = () => {
	const { data: categories } = useCategories();
	const { values, getInputProps, onSubmit, errors, validateField, setFieldValue, clearFieldError } =
		useForm({
			initialValues: DEFAULT_FORM_VALUES,
			validate: createProductValidation,
			validateInputOnBlur: true,
			validateInputOnChange: true,
		});

	// FETCH TAGS FROM SERVER
	const [tags, setTags] = useState<{ value: string; label: string }[]>([]);

	const { publishDatetime, allowShipping, allowPreOrder, preOrderRange, sameAsStoreAddress } =
		values;

	const categoryOptions = categories?.data.map((category) => ({
		value: category.id,
		label: category.name,
	}));

	const submitHandler = (values: CreateProductValues) => {
		console.log(values);
	};

	return (
		<form
			className='create-product-container flex flex-col gap-10 w-full pb-5'
			onSubmit={onSubmit(submitHandler)}
		>
			<div className='card general-wrapper'>
				<h2 className='text-xl font-bold'>General information</h2>
				<div className='flex flex-col-reverse md:flex-row mt-5 gap-10'>
					<div className='grid grid-cols-12 w-full gap-5 md:gap-x-10'>
						<TextInput
							label='Product name'
							className='col-span-12'
							withAsterisk
							{...getInputProps('name')}
						/>
						<MultiSelect
							data={tags}
							label='Tags'
							className='col-span-12'
							searchable
							clearable
							nothingFound='Nothing found'
							classNames={{
								values: '!mr-0',
							}}
							creatable
							getCreateLabel={(query) => `+ Create ${query}`}
							onCreate={(query) => {
								const item = { value: query, label: query };
								setTags((prev) => [...prev, item]);
								return item;
							}}
							{...getInputProps('tags')}
						/>
						<NumberInput
							label='Quantity'
							className='col-span-6 md:col-span-4'
							withAsterisk
							min={0}
							{...getInputProps('remainingQuantity')}
						/>
						<div className='flex col-span-12 md:col-span-8 order-1 md:order-none'>
							<NumberInput
								label='Price'
								withAsterisk
								className='flex-[3]'
								hideControls
								classNames={{
									input: 'rounded-r-none',
								}}
								min={1}
								{...getInputProps('price.value')}
							/>
							<Select
								data={CURRENCIES}
								label='Unit'
								withAsterisk
								className='flex-[1]'
								classNames={{
									input: 'rounded-l-none',
								}}
								{...getInputProps('price.unit')}
							/>
						</div>
						<NumberInput
							label='Limit per order'
							className='col-span-6 md:col-span-4'
							withAsterisk
							min={0}
							{...getInputProps('maxItemsPerOrder')}
						/>
						<Select
							data={categoryOptions || []}
							className='col-span-12 md:col-span-8 order-1 md:order-none'
							label='Category'
							nothingFound='Nothing found'
							searchable
							withAsterisk
							allowDeselect
							{...getInputProps('category')}
						/>
						<Textarea
							label='Description'
							className='col-span-12 row-span-6 order-1 md:order-none'
							classNames={{
								root: 'flex flex-col',
								wrapper: 'flex-1',
								input: 'h-full',
							}}
							{...getInputProps('description')}
						/>
					</div>
					<div className='image-wrapper flex flex-col md:w-6/12'>
						<h2>Images</h2>
						<div className='border-dashed border-2 border-gray-primary w-full md:w-full aspect-square rounded-lg flex-1 mt-1 max-h-80 md:max-h-full mx-auto'>
							doesnt work because im too lazy to make popup right now
						</div>
						<div className='flex gap-5 mt-5'>
							<div className='border-dashed border-2 border-gray-primary w-1/3 aspect-square rounded-lg'>
								f
							</div>
							<div className='border-dashed border-2 border-gray-primary w-1/3 aspect-square rounded-lg'>
								b
							</div>
							<div className='border-dashed border-2 border-gray-primary w-1/3 aspect-square rounded-lg'>
								t
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='card pre-order-wrapper'>
				<div className='flex justify-between'>
					<h2 className='text-xl font-bold'>Pre-order information</h2>
					<Switch
						label='Allow pre-order'
						size='md'
						offLabel={<span className='text-sm'>|</span>}
						onLabel={<span className='text-base'>O</span>}
						{...getInputProps('allowPreOrder', {
							type: 'checkbox',
						})}
						onChange={(e) => {
							getInputProps('allowPreOrder').onChange(e);
							if (!e.target.checked) {
								clearFieldError('preOrderRange');
								clearFieldError('publishDatetime');
							} else {
								validateField('preOrderRange');
								validateField('publishDatetime');
							}
						}}
					/>
				</div>
				<div
					className={clsx(
						'grid grid-cols-12 transition-all gap-5 md:gap-x-10',
						allowPreOrder ? 'opacity-100 mt-5' : 'h-0 pointer-events-none opacity-0'
					)}
				>
					<DatePickerInput
						type='range'
						label='Pre-order date range'
						placeholder='Pick dates range'
						className='col-span-12 md:col-span-6'
						withAsterisk
						numberOfColumns={2}
						{...getInputProps('preOrderRange')}
						onChange={(value) => {
							const [start, end] = value;
							if (start && end && publishDatetime && end <= publishDatetime) {
								clearFieldError('publishDatetime');
							}
							setFieldValue('preOrderRange', value);
						}}
					/>
					<DatePickerInput
						label='Release date'
						placeholder='Pick a date'
						className='col-span-12 md:col-span-6'
						withAsterisk
						{...getInputProps('publishDatetime')}
						onChange={(value) => {
							const [start, end] = preOrderRange;
							if (start && end && value && end <= value) {
								clearFieldError('preOrderRange');
							}
							setFieldValue('publishDatetime', value);
						}}
					/>
				</div>
			</div>
			<div className='card shipping-payment-wrapper'>
				<h2 className='text-xl font-bold'>Shipping & payment methods</h2>
				<Switch
					className='mt-5'
					label='Allow shipping'
					size='md'
					offLabel={<span className='text-sm'>|</span>}
					onLabel={<span className='text-base'>O</span>}
					{...getInputProps('allowShipping', { type: 'checkbox' })}
					onChange={(e) => {
						getInputProps('allowShipping').onChange(e);
						if (e.target.checked) {
							clearFieldError('pickupLocation');
						} else {
							validateField('pickupLocation');
						}
					}}
				/>
				<div
					className={clsx(
						'shipping-wrapper grid grid-cols-12 gap-5 md:gap-x-10 transition-all',
						!allowShipping ? 'opacity-100 mt-5' : 'h-0 pointer-events-none opacity-0'
					)}
				>
					<TextInput
						label='Pick up at'
						className='col-span-12 md:col-span-10'
						{...getInputProps('pickupLocation')}
						disabled={sameAsStoreAddress}
					/>
					<Input.Wrapper label='Same as my shop' className='col-span-12 md:col-span-2'>
						<Switch
							size='md'
							offLabel={<span className='text-sm'>|</span>}
							onLabel={<span className='text-base'>O</span>}
							{...getInputProps('sameAsStoreAddress', {
								type: 'checkbox',
							})}
							onChange={(e) => {
								getInputProps('sameAsStoreAddress').onChange(e);
								if (e.target.checked) {
									setFieldValue('pickupLocation', 'NICE FORM VALIDATION');
								} else {
									setFieldValue('pickupLocation', '');
								}
							}}
						/>
					</Input.Wrapper>
				</div>
				<h2 className='text-xl font-bold mt-5'>Payment information</h2>
				<Checkbox.Group
					className='flex flex-col gap-3 mt-5'
					{...getInputProps('paymentMethods', {
						type: 'checkbox',
					})}
				>
					<Checkbox value='cod' label='Cash on delivery' />
					<Checkbox value='bank' label='Bank transfer' />
				</Checkbox.Group>
			</div>
			<div className='btn-wrapper flex flex-col-reverse md:flex-row gap-5 w-full md:w-max ml-auto bg-white p-5 rounded-lg md:bg-transparent sm:p-0'>
				<Button variant='outline' type='button'>
					Cancel
				</Button>
				<Button className='bg-primary' type='submit'>
					Publish
				</Button>
			</div>
		</form>
	);
};

export default CreateProductContainer;
