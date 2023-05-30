import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import { Open_Sans } from 'next/font/google';
import { SWRConfig } from 'swr';

const openSans = Open_Sans({
	subsets: ['latin', 'vietnamese'],
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: 'light',
				fontFamily: openSans.style.fontFamily,
				// Generate here https://omatsuri.app/color-shades-generator
				colors: {
					customPrimary: [
						'#FFFDFE',
						'#FEAAD8',
						'#FC64B8',
						'#FB2B9E',
						'#F10487',
						'#C1036C',
						'#9A0356',
						'#7B0245',
						'#630237',
						'#4F012C',
					],
					customSecondary: [
						'#F2E3FA',
						'#D1A0ED',
						'#B768E3',
						'#A03ADA',
						'#8924C2',
						'#6E1D9B',
						'#58177C',
						'#461263',
						'#380F4F',
						'#2D0C40',
					],
				},
				// index of shade
				primaryShade: 4,
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
						font-family: ${openSans.style.fontFamily};
					}
				`}
			</style>
			<ModalsProvider>
				<Notifications limit={5} autoClose={4000} />
				<SWRConfig>
					<Component {...pageProps} />
				</SWRConfig>
			</ModalsProvider>
		</MantineProvider>
	);
}
