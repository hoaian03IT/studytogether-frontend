import { Button, Image, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { IoMdClose } from "react-icons/io";
import { Audio } from "./audio";

export const FlashCardModal = ({ words, isOpen, onClose }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);

	const handleFlip = () => {
		setIsFlipped(!isFlipped);
	};

	const handleNext = () => {
		setIsFlipped(false);
		if (!isFlipped) {
			setIsFlipped(true);
		} else if (currentIndex < words.length - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	useEffect(() => {
		console.log(currentIndex);
	}, [currentIndex]);

	const handleBack = () => {
		if (isFlipped) {
			setIsFlipped(false);
		} else if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};
	return (
		<Modal
			isOpen={isOpen}
			size="4xl"
			className="p-0"
			closeButton={
				<Button onPress={onClose} isIconOnly={true} size="lg">
					<IoMdClose className="size-20" />
				</Button>
			}>
			<ModalContent className="p-0">
				<ModalBody className="p-0">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#f4f6f8",
							padding: "40px 20px",
						}}>
						<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
							{/* Front Side */}
							<div
								onClick={handleFlip}
								style={{
									width: "600px",
									height: "400px",
									backgroundColor: "#fff",
									borderRadius: "12px",
									boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									cursor: "pointer",
									padding: "20px",
									position: "relative",
								}}>
								{words[currentIndex]?.image && (
									<Image
										src={words[currentIndex]?.image}
										className="size-28 object-cover object-center"
									/>
								)}
								<p
									style={{
										fontSize: "24px",
										color: "#007bff",
										fontWeight: "500",
										textAlign: "center",
									}}>
									{words[currentIndex]?.word}
									<br />
									{words[currentIndex]?.transcription}
								</p>
								<Audio src={words[currentIndex]?.pronunciation} />
							</div>

							{/* Back Side */}
							<div
								onClick={handleFlip}
								style={{
									width: "600px",
									height: "400px",
									backgroundColor: "#fff",
									borderRadius: "12px",
									boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									cursor: "pointer",
									padding: "20px",
									position: "relative",
								}}>
								<p
									style={{
										fontSize: "24px",
										color: "#007bff",
										fontWeight: "500",
										textAlign: "center",
									}}>
									({words[currentIndex]?.type})&nbsp;{words[currentIndex]?.definition}
								</p>
							</div>
						</ReactCardFlip>

						<div style={{ marginTop: "30px" }}>
							<button
								onClick={handleBack}
								disabled={currentIndex === 0}
								style={{
									marginRight: "10px",
									padding: "10px 20px",
									fontSize: "16px",
									backgroundColor: "#6c757d",
									color: "white",
									border: "none",
									borderRadius: "8px",
									cursor: currentIndex === 0 ? "not-allowed" : "pointer",
									opacity: currentIndex === 0 ? 0.5 : 1,
								}}>
								Back
							</button>
							<button
								onClick={handleNext}
								disabled={currentIndex === words.length - 1}
								style={{
									padding: "10px 20px",
									fontSize: "16px",
									backgroundColor: "#007bff",
									color: "white",
									border: "none",
									borderRadius: "8px",
									cursor: currentIndex === words.length - 1 ? "not-allowed" : "pointer",
									opacity: currentIndex === words.length - 1 ? 0.5 : 1,
								}}>
								Next
							</button>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
