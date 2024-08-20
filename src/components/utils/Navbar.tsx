import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Modal } from "./Modal";
import { Login } from "../auth/Login";
import { Signup } from "../auth/Signup";
import { UserIdentity } from "../../hooks/useAuthStatus";

type NavbarProps = {
	isLoggedIn: boolean;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
	userIdentity: UserIdentity | null;
	setUserIdentity: Dispatch<SetStateAction<UserIdentity | null>>;
};

export const Navbar = ({
	isLoggedIn,
	setIsLoggedIn,
	userIdentity,
	setUserIdentity
}: NavbarProps) => {
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
			setIsLoggedIn(false); // consider finding a way to remove the ability to set is logged in from the client side
			setUserIdentity(null);
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
				{isLoggedIn && userIdentity ? (
					<>
						{/* remove logout button in production */}
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
						<button
							style={{
								width: "50px",
								height: "50px",
								borderRadius: "50%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								cursor: "pointer",
								border: "none",
								overflow: "hidden",
								padding: "0",
								backgroundColor: "transparent",
								marginLeft: "20px"
							}}
						>
							<img
								src={userIdentity.picture}
								alt="Profile Picture"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									borderRadius: "50%",
									border: "none"
								}}
							/>
						</button>
					</>
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
