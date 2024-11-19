import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { Image } from "@nextui-org/image";
import React from "react";

const WordDefinition = () => {
	return <div>
		<div className="flex-1 flex flex-col mt-10 space-y-10">
		</div>
		<div className="flex justify-between items-start">
			<div className="space-y-8">
				<div>
					<p className="uppercase text-sm">word</p>
					<div className="flex items-center gap-4">
						<p className="ms-4 text-4xl"><strong>Long</strong> (adj) - /lɒŋ/</p>
						<button className="active:opacity-60 transition-all">
							<HiOutlineSpeakerWave
								className="size-10" />
						</button>
					</div>
				</div>
				<div>
					<p className="uppercase text-sm">definition</p>
					<p className="ms-4 text-3xl">Dài, lâu</p>
				</div>
			</div>
			<div>
				<Image className="max-h-60 max-w-60"
					   src="https://upload.wikimedia.org/wikipedia/commons/d/de/Nokota_Horses_cropped.jpg" />
			</div>
		</div>
		<div className="space-y-2 text-sm">
			<p className="uppercase text-sm">example</p>
			<div className="flex items-start gap-2 text-gray-800 ms-4">
				<p>Ex 1:</p>
				<div>
					<p>Dùng theo nghĩa dài</p>
					<p className="font-semibold">This way is too long to run.</p>
					<p>Explain: Đây là một con đường quá dài đến nỗi không thể chạy.</p>
				</div>
			</div>
			<div className="flex items-start gap-2 text-gray-800 ms-4">
				<p>Ex 2:</p>
				<div>
					<p>Dùng theo nghĩa dài</p>
					<p className="font-semibold">This way is too long to run.</p>
					<p>Explain: Đây là một con đường quá dài đến nỗi không thể chạy.</p>
				</div>
			</div>
			<div className="flex items-start gap-2 text-gray-800 ms-4">
				<p>Ex 3:</p>
				<div>
					<p>Dùng theo nghĩa dài</p>
					<p className="font-semibold">This way is too long to run.</p>
					<p>Explain: Đây là một con đường quá dài đến nỗi không thể chạy.</p>
				</div>
			</div>
		</div>
	</div>;
};

export { WordDefinition };