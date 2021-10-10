import React from 'react';

const Layout = props => {
	const { children } = props;

	return (
		<div>
			<h1>Mail sender</h1>
			<main>
				{children}
			</main>
		</div>
	);
};

export default Layout;
