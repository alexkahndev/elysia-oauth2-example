import { Navbar } from "../components/utils/Navbar";
import { Footer } from "../components/utils/Footer";
import { useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";

export const ClientPortal = () => {
	const [count, setCount] = useState(0);
	const [isLoggedIn, setIsLoggedIn] = useAuthStatus();
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<title>Awesome.Social</title>
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
				<Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
				<main
					style={{
						flex: "1",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						padding: "20px",
						backgroundColor: "#fff",
						textAlign: "center"
					}}
				>
					<h1 style={{ marginBottom: "20px" }}>Client Portal</h1>
					<p style={{ marginBottom: "20px", maxWidth: "600px" }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed malesuada, eros nec cursus tincidunt, mi nunc
						ultricies erat, at lacinia elit ex nec turpis. Aliquam
						erat volutpat. Nulla facilisi. Nullam sit amet turpis
						nec nunc tincidunt lacinia. Proin euismod risus eu enim
						iaculis, vel ultricies nunc varius. Nullam auctor
						tincidunt sapien, nec ultricies erat. Nullam nec risus
						auctor, efficitur nunc in, tincidunt lorem. Donec sit
						amet magna nec nunc tincidunt ultricies. Nulla facilisi.
						Sed id nunc auctor, ultricies purus nec, vehicula ex.
						Nullam nec nunc et nunc tincidunt interdum sit amet nec
						eros. Sed nec magna nec eros tincidunt pharetra. Nullam
						nec dolor ut nisi vehicula ultricies. Nulla facilisi.
						Nullam tincidunt, ex nec luctus vehicula, nunc nunc
						tincidunt metus, eget ultricies nunc eros nec libero.
						Nullam nec odio nec nunc tincidunt ultricies. Nulla
						facilisi. Nullam nec nunc tincidunt, ultricies turpis
						nec, vehicula nunc. Nulla facilisi. Nullam nec nunc
						tincidunt, ultricies turpis nec, vehicula nunc. Nulla
						facilisi. Nullam nec nunc tincidunt, ultricies turpis
						nec, vehicula nunc. Nulla facilisi.
					</p>
					<button
						onClick={() => setCount(count + 1)}
						style={{
							padding: "10px 20px",
							fontSize: "16px",
							cursor: "pointer",
							borderRadius: "5px",
							border: "none",
							backgroundColor: "#007BFF",
							color: "#fff",
							marginBottom: "20px"
						}}
					>
						Click me
					</button>
					<p style={{ fontSize: "18px" }}>Count: {count}</p>
				</main>
				<Footer />
			</body>
		</html>
	);
};
