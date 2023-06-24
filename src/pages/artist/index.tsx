import axiosClient from '@/services/backend/axiosClient';
import { Button } from '@mantine/core';

const ArtistDashboardPage = () => {
	const becomeArtistFuckU = async () => {
		try {
			await axiosClient.post('/registration/artist');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h1>Artist dashboard page</h1>
			<Button className='bg-primary' onClick={becomeArtistFuckU}>
				Artist transform
			</Button>
		</div>
	);
};

export default ArtistDashboardPage;
