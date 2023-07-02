import { Suspense, forwardRef, useImperativeHandle, useRef } from 'react';
import { Three } from './Base';
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei';

export const Common = ({ color }: any) => (
	<Suspense fallback={null}>
		{color && <color attach='background' args={[color]} />}
		<ambientLight intensity={0.5} />
		<pointLight position={[20, 30, 10]} intensity={1} />
		<pointLight position={[-10, -10, -10]} color='blue' />
		{/* @ts-ignore they receive undefined but are required lol*/}
		<PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
	</Suspense>
);

const View = forwardRef(({ children, orbit, ...props }: any, ref) => {
	const localRef = useRef<any>();
	useImperativeHandle(ref, () => localRef.current);

	return (
		<>
			<div ref={localRef} {...props} />
			<Three>
				<ViewImpl track={localRef}>
					{children}
					{orbit && <OrbitControls />}
				</ViewImpl>
			</Three>
		</>
	);
});
View.displayName = 'View';

export { View };
