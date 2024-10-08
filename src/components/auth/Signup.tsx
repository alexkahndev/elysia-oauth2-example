import React, { useState } from "react";

type SignupProps = {
	switchToLogin: () => void;
};

export const Signup = ({ switchToLogin }: SignupProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleGoogleSignup = async () => {
		await fetch("/set-redirect-url", { method: "POST" });
		window.location.href = "/auth/google";
	};

	const handleSignup = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (password !== confirmPassword) {
			alert("Passwords do not match!");
			return;
		}

		const response = await fetch(`/auth/app/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email, password })
		});

		console.log("signed up", response);
	};

	return (
		<form style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
			<h2
				style={{
					marginBottom: "20px",
					fontSize: "24px",
					textAlign: "center",
					color: "#333"
				}}
			>
				Sign Up
			</h2>
			<input
				type="email"
				autoComplete="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				style={{
					display: "block",
					width: "100%",
					padding: "10px",
					marginBottom: "10px",
					border: "1px solid #ccc",
					borderRadius: "4px"
				}}
			/>
			<input
				type="password"
				autoComplete="new-password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				style={{
					display: "block",
					width: "100%",
					padding: "10px",
					marginBottom: "10px",
					border: "1px solid #ccc",
					borderRadius: "4px"
				}}
			/>
			<input
				type="password"
				autoComplete="new-password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				placeholder="Confirm Password"
				style={{
					display: "block",
					width: "100%",
					padding: "10px",
					marginBottom: "20px",
					border: "1px solid #ccc",
					borderRadius: "4px"
				}}
			/>
			<button
				onClick={handleGoogleSignup}
				style={{
					display: "block",
					width: "100%",
					padding: "10px",
					marginBottom: "10px",
					backgroundColor: "#4285F4",
					color: "#fff",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer"
				}}
			>
				Sign Up with Google
			</button>
			<button
				onClick={handleSignup}
				style={{
					display: "block",
					width: "100%",
					padding: "10px",
					backgroundColor: "#333",
					color: "#fff",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer"
				}}
			>
				Sign Up
			</button>
			<p
				style={{
					textAlign: "center",
					marginTop: "20px",
					color: "#333",
					cursor: "pointer"
				}}
				onClick={switchToLogin}
			>
				Already have an account? Login here.
			</p>
		</form>
	);
};
