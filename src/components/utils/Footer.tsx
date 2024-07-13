export const Footer = () => {
	return (
		<footer
			style={{
				backgroundColor: "#333",
				padding: "20px",
				color: "#fff",
				textAlign: "center"
			}}
		>
			<article
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center"
				}}
			>
				<p style={{ margin: "10px 0" }}>
					&copy; {new Date().getFullYear()} Awesome.Social Inc. All
					rights reserved.
				</p>
				<div>
					<a
						href="/terms"
						style={{
							color: "#fff",
							textDecoration: "none",
							margin: "0 10px"
						}}
					>
						Terms of Service
					</a>
					<a
						href="/privacy"
						style={{
							color: "#fff",
							textDecoration: "none",
							margin: "0 10px"
						}}
					>
						Privacy Policy
					</a>
				</div>
			</article>
		</footer>
	);
};
