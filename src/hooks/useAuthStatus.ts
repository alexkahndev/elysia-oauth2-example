import { useState, useEffect, Dispatch, SetStateAction } from "react";

export type UserIdentity = {
	givenName: string;
	familyName: string;
	email: string;
	picture: string;
};

export const useAuthStatus = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);

	const checkAuthStatus = async () => {
		try {
			const response = await fetch("/auth-status");

			if (response.ok) {
				const data = await response.json();

				setIsLoggedIn(data.isLoggedIn);
				setUserIdentity({
					givenName: data.givenName,
					familyName: data.familyName,
					email: data.email,
					picture: data.picture
				});
			} else {
				console.error("Failed to check auth status");
			}
		} catch (error) {
			console.error("Error checking auth status:", error);
		}
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	return {
		isLoggedIn,
		setIsLoggedIn,
		userIdentity,
		setUserIdentity
	};
};
