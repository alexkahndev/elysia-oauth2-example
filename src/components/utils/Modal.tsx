import { ReactNode, MouseEvent } from "react";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	if (!isOpen) return null;

	const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			onClick={handleBackgroundClick}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<div
				style={{
					backgroundColor: "#fff",
					padding: "20px",
					borderRadius: "8px",
					minWidth: "300px",
					zIndex: 1000,
					position: "relative"
				}}
			>
				<button
					onClick={onClose}
					style={{
						position: "absolute",
						top: "10px",
						right: "10px",
						backgroundColor: "transparent",
						border: "none",
						fontSize: "16px",
						cursor: "pointer"
					}}
				>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};
