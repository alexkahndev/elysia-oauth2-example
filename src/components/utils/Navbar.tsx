import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Login } from "../auth/Login";
import { Signup } from "../auth/Signup";

type NavbarProps = {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Navbar = ({ isLoggedIn, setIsLoggedIn }: NavbarProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoginView, setIsLoginView] = useState(true);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const switchToLogin = () => {
		setIsLoginView(true);
	};

	const switchToSignUp = () => {
		setIsLoginView(false);
	};

	const handleLoginClick = () => {
		openModal();
		switchToLogin();
	};

	const handleSignUpClick = () => {
		openModal();
		switchToSignUp();
	};

	const handleSignOut = async () => {
		const response = await fetch("/logout", { method: "POST" });
		if (response.ok) {
			setIsLoggedIn(false);
		} else {
			console.error("Logout failed");
		}
	};

	return (
		<header
			style={{
				backgroundColor: "#333",
				padding: "10px 20px",
				color: "#fff",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between"
			}}
		>
			<a href="/">
				<img
					src="/assets/svg/brand_logo.svg"
					alt="Awesome.Social Logo"
					style={{ height: "40px" }}
				/>
			</a>
			<nav style={{ display: "flex", alignItems: "center" }}>
				<a
					href="/portal"
					style={{
						color: "#fff",
						textDecoration: "none",
						fontSize: "16px",
						marginRight: "20px"
					}}
				>
					Portal
				</a>
				{isLoggedIn ? (
					<button
						onClick={handleSignOut}
						style={{
							color: "#fff",
							backgroundColor: "transparent",
							border: "1px solid #fff",
							borderRadius: "4px",
							fontSize: "16px",
							padding: "8px 16px",
							cursor: "pointer"
						}}
					>
						Sign Out
					</button>
				) : (
					<>
						<button
							onClick={handleLoginClick}
							style={{
								color: "#fff",
								backgroundColor: "transparent",
								border: "none",
								fontSize: "16px",
								marginRight: "20px",
								cursor: "pointer"
							}}
						>
							Login
						</button>
						<button
							onClick={handleSignUpClick}
							style={{
								color: "#fff",
								backgroundColor: "transparent",
								border: "1px solid #fff",
								borderRadius: "4px",
								fontSize: "16px",
								padding: "8px 16px",
								cursor: "pointer"
							}}
						>
							Sign Up
						</button>
					</>
				)}
			</nav>

			<Modal isOpen={isModalOpen} onClose={closeModal}>
				{isLoginView ? (
					<Login switchToSignUp={switchToSignUp} />
				) : (
					<Signup switchToLogin={switchToLogin} />
				)}
			</Modal>
		</header>
	);
};
