import {
	NumberInput,
	Input,
	MultiSelect,
	Switch,
	TextInput,
	Textarea,
	Select,
	Checkbox,
	Button,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

const data = [...Array(10)].map((_, index) => ({
	value: `${index}`,
	label: `Option ${index}`,
}));

const CreatePage = () => {
	return (
		<div className='layout-with-sidenav max-w-7xl mx-auto flex gap-10 px-5'>
			<nav className='side-nav w-40 card hidden lg:block'>Nav bar</nav>
			<main className='main-wrapper flex flex-col gap-10 w-full pb-5'>
				<div className='card'>
					<h2 className='text-lg font-bold'>General information</h2>
					<div className='flex flex-col-reverse sm:flex-row mt-5 gap-10'>
						<div className='grid grid-cols-12 w-full gap-5'>
							<TextInput label='Product' className='col-span-12' withAsterisk />
							<Select
								data={data}
								label='Category'
								className='sm:col-span-8 col-span-12'
								nothingFound='Nothing found'
								searchable
								withAsterisk
							/>
							<Input.Wrapper
								label='Member only'
								className='col-span-4 order-last sm:order-none'
								withAsterisk
							>
								<Switch />
							</Input.Wrapper>
							<MultiSelect
								data={data}
								label='Tags'
								className='col-span-12'
								searchable
								nothingFound='Nothing found'
								clearable
								classNames={{
									values: '!mr-0',
								}}
							/>
							<Textarea
								label='Description'
								className='col-span-12 row-span-6'
								classNames={{
									root: 'flex flex-col',
									wrapper: 'flex-1',
									input: 'h-full',
								}}
							/>
						</div>
						<div className='flex flex-col sm:w-5/12'>
							<h2>Images</h2>
							<div className='border-dashed border-2 border-black w-full sm:w-full aspect-square rounded-lg flex-1 mt-1'></div>
							<div className='flex gap-5 mt-5'>
								<div className='border-dashed border-2 border-black w-1/3 aspect-square rounded-lg'></div>
								<div className='border-dashed border-2 border-black w-1/3 aspect-square rounded-lg'></div>
								<div className='border-dashed border-2 border-black w-1/3 aspect-square rounded-lg'></div>
							</div>
						</div>
					</div>
				</div>
				<div className='card'>
					<h2 className='text-lg font-bold'>Order confirmation</h2>
					<div className='grid grid-cols-12 gap-5 gap-x-10 mt-5'>
						<NumberInput
							label='Price'
							className='col-span-12 sm:col-span-6'
							icon='$'
							withAsterisk
						/>
						<NumberInput label='Amount' className='col-span-12 sm:col-span-6' withAsterisk />
						<DatePickerInput
							type='range'
							label='Pick dates range'
							placeholder='Pick dates range'
							className='col-span-12 sm:col-span-6'
							withAsterisk
						/>
						<NumberInput label='Limit' className='col-span-6 sm:col-span-3' />
						<TextInput label='Unit' className='col-span-6 sm:col-span-3' withAsterisk />
					</div>
				</div>
				<div className='card'>
					<h2 className='text-lg font-bold'>Shipping & payment methods</h2>
					<div className='grid grid-cols-12 gap-5 gap-x-10 mt-5'>
						<Switch label='Shipping' className='col-span-12' />
						<h3 className='col-span-12'>Payment method:</h3>
						<Checkbox label='Trả sau bằng tiền mặt (COD)' className='col-span-12' />
						<Checkbox label='Thanh toán qua thẻ' className='col-span-12' />
					</div>
				</div>
				<div className='btn-wrapper flex flex-col-reverse sm:flex-row gap-5 w-full sm:w-max ml-auto bg-white p-5 rounded-lg sm:bg-transparent sm:p-0'>
					<Button variant='outline' type='button'>
						Cancel
					</Button>
					<Button className='bg-primary' type='submit'>
						Publish
					</Button>
				</div>
			</main>
		</div>
	);
};

export default CreatePage;
