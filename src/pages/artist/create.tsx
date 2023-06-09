import CreateProductContainer from '@/containers/CreateProductContainer/CreateProductContainer';

const CreatePage = () => {
	return (
		<div className='layout-with-sidenav max-w-7xl mx-auto flex gap-10 px-5'>
			<nav className='side-nav w-40 card hidden lg:block'>Nav bar</nav>
			<CreateProductContainer />
		</div>
	);
};

export default CreatePage;
