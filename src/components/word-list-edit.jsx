import { IoVolumeHigh } from "react-icons/io5";
import { FcEditImage } from "react-icons/fc";
import { ImBin } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import React, { useState } from "react";
import { Audio } from "./audio.jsx";
import { Image, Modal, ModalBody, ModalContent } from "@nextui-org/react";

export const WordListEdit = ({ index, word, handleDeleteConfirmation, handleEdit }) => {
	const [showImage, setShowImage] = useState(false);
	return (
		<li className="grid grid-cols-12 bg-gray-100 p-1 rounded-sm items-center gap-x-2 my-2">
			<p className="font-bold col-span-3">
				{index + 1}. {word?.word} ({word?.type})
			</p>
			<p className="col-span-3 ml-4">{word?.definition}</p>
			<div className="col-span-1 justify-self-center">
				<Audio
					src={word?.pronunciation}
					autoPlay={false}
					Icon={IoVolumeHigh}
					size="sm"
					show={!!word?.pronunciation}
				/>
			</div>
			<div className="col-span-1 justify-self-center">
				{word?.image && (
					<button
						onClick={() => {
							setShowImage(true);
						}}>
						<FcEditImage className="size-10" />
					</button>
				)}
			</div>
			<p className="col-span-2">{word?.transcription}</p>
			<div className="col-span-2 flex justify-end items-center gap-4">
				<button onClick={handleDeleteConfirmation} className="text-red-500 hover:text-red-700 transition">
					<ImBin />
				</button>
				<button className="text-primary hover:text-blue-800	transition">
					<MdEdit className="size-5" onClick={handleEdit} />
				</button>
			</div>
			<Modal
				isOpen={showImage && word?.image}
				size="sm"
				onClose={() => {
					setShowImage(false);
				}}>
				<ModalContent>
					<ModalBody className="p-1">
						<Image src={word?.image} alt={word?.word} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</li>
	);
};
