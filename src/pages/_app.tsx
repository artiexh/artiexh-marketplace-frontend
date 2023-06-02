import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import { Nunito } from 'next/font/google';
import { SWRConfig } from 'swr';
import AuthGuard from '@/services/guards/AuthGuard';

const nunito = Nunito({
	subsets: ['latin', 'vietnamese'],
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: 'light',
				fontFamily: nunito.style.fontFamily,
				// Generate here https://omatsuri.app/color-shades-generator
				colors: {
					customPrimary: [
						'#EBDEF7',
						'#C4A0E7',
						'#A56CD9',
						'#8A41CE',
						'#732EB4',
						'#602696',
						'#50207D',
						'#401A64',
						'#331450',
						'#291040',
					],
					customSecondary: [
						'#F9F5FC',
						'#D7C3E9',
						'#BA98DA',
						'#A172CC',
						'#8C52C1',
						'#793FAE',
						'#683696',
						'#572D7E',
						'#49266A',
						'#3E2059',
					],
				},
				// index of shade
				primaryShade: 6,
				// DO NOT REFERENCE HEX DIRECTLY, ONLY COLORS FROM theme.colors
				primaryColor: 'customPrimary',
				defaultGradient: {
					deg: 135,
					from: 'customPrimary',
					to: 'customSecondary',
				},
			}}
		>
			<style jsx global>
				{`
					html {
						font-family: ${nunito.style.fontFamily};
					}
				`}
			</style>
			<ModalsProvider>
				<Notifications limit={5} autoClose={4000} />
				<SWRConfig>
					<AuthGuard />
					<Component {...pageProps} />
				</SWRConfig>
			</ModalsProvider>
		</MantineProvider>
	);
}
