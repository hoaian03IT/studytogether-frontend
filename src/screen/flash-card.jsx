import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

const FlashCard = () => {
	// Hàm chuyển đến câu hỏi tiếp theo
	const nextQuestion = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
			setSelectedOption(null); 
		}
	};

	const prevQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
			setSelectedOption(null);
		}
	};
	return (
		<div className='flex items-center justify-center bg-gray-100 w-full min-h-screen'>
			<div className='flex items-center bg-slate-400 flex-col px-12 py-10 rounded-lg border-2 border-gray-400 w-4/6 space-y-20 bg-white'>
				<div className='bg-white p-6 rounded-lg  border-1 border-gray-400 w-full'>
					<p className='text-gray-800 mb-4'>
						Câu 1: I didn’t think his comments were very appropriate
						at the time.
					</p>
					<ul className='space-y-2'>
						<li className='text-gray-700'>A. correct</li>
						<li className='text-gray-700'>B. right</li>
						<li className='text-gray-700'>C. exact</li>
						<li className='text-gray-700'>D. suitable</li>
					</ul>
				</div>

				<div className='flex space-x-2 mt-4 mt-4>'>
					<Button
						isIconOnly
						color='danger'
						aria-label='Like'
						onClick={prevQuestion}>
						<FaArrowLeftLong />
					</Button>
					<Button
						isIconOnly
						color='danger'
						aria-label='Like'
						onChangeCapture={nextQuestion}>
						<FaArrowRightLong />
					</Button>
				</div>
			</div>
		</div>
	);
};
export default FlashCard;
