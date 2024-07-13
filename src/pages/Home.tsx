import { Navbar } from "../components/utils/Navbar";
import { Footer } from "../components/utils/Footer";
import { useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";

export const Home = () => {
	const [color, setColor] = useState<string>("#007BFF");
	const [isLoggedIn, setIsLoggedIn] = useAuthStatus();
	
	const colors = [
		"#007BFF",
		"#6f42c1",
		"#28a745",
		"#ffc107",
		"#dc3545",
		"#17a2b8",
		"#fd7e14",
		"#20c997",
		"#6610f2",
		"#e83e8c",
		"#6c757d",
		"#343a40",
		"#007bff",
		"#6f42c1",
		"#28a745",
		"#ffc107",
		"#dc3545",
		"#17a2b8",
		"#fd7e14",
		"#20c997",
		"#6610f2",
		"#e83e8c",
		"#6c757d",
		"#343a40"
	];

	const changeColor = () => {
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		setColor(randomColor);
	};

	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<title>Elysia Starter SSR</title>
				<meta name="description" content="Bun, Elysia & React" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/assets/ico/favicon.ico" />
			</head>
			<body
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
					margin: "0"
				}}
			>
				<Navbar
					isLoggedIn={isLoggedIn}
					setIsLoggedIn={setIsLoggedIn}
				/>
				<main
					style={{
						flex: "1",
						backgroundColor: "#fff",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						padding: "20px",
						textAlign: "center"
					}}
				>
					<h1 style={{ marginBottom: "20px" }}>
						Welcome to Awesome.Social!
					</h1>
					<p style={{ marginBottom: "20px", maxWidth: "600px" }}>
						Awesome.Social is your go-to platform for connecting
						with amazing people and sharing your thoughts with the
						world. Join us today and be part of a thriving
						community.
					</p>
					<button
						onClick={changeColor}
						style={{
							padding: "10px 20px",
							fontSize: "16px",
							cursor: "pointer",
							borderRadius: "5px",
							border: "none",
							backgroundColor: color,
							color: "#fff",
							marginTop: "20px"
						}}
					>
						Change Button Color
					</button>
				</main>
				<Footer />
			</body>
		</html>
	);
};
