import { IoVolumeHigh } from "react-icons/io5";
import { FcEditImage } from "react-icons/fc";
import { ImBin } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import React from "react";
import { Audio } from "./audio.jsx";

export const WordListEdit = ({ index, word, handleDeleteConfirmation, handleEdit }) => {
	return <li
		className="grid grid-cols-7 bg-gray-100 p-2 rounded-sm items-center gap-x-2 my-2">
		<p className="font-bold col-span-2">{index + 1}. {word?.word} ({word?.type})</p>
		<p className="col-span-2 ml-4">{word?.definition}</p>
		<div className="col-span-1 flex justify-center items-center">
			<Audio src={word?.pronunciation} autoPlay={false} Icon={IoVolumeHigh} size="sm"
				   show={!!word?.pronunciation} />
		</div>
		<div className="col-span-1 flex justify-center items-center">
			{word?.image && <FcEditImage size={24} />}
		</div>
		<div className="col-span-1 flex justify-center items-center gap-4">
			<button
				onClick={handleDeleteConfirmation}
				className="text-red-500 hover:text-red-700 transition">
				<ImBin />
			</button>
			<button
				className="text-primary hover:text-blue-800	transition">
				<MdEdit className="size-5"
						onClick={handleEdit} />
			</button>
		</div>
	</li>;
};