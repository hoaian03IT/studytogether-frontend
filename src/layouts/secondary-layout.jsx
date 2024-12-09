import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { pathname } from "../routes";

export default function SecondaryLayout({ children }) {
	const navigate = useNavigate();

	const handleClose = () => {
		navigate(pathname.home);
	};

	return (
		<div className='flex h-screen'>
			<div className='w-1/2 flex flex-col justify-center items-center bg-white p-4'>{children}</div>
			<div className='w-1/2 relative'>
				<button
					onClick={handleClose}
					className='absolute top-4 right-4 text-4xl font-bold text-gray-600 hover:text-gray-900'>
					<FaTimes />
				</button>
				<img
					src='/src/assets/background.png'
					alt='Study Together'
					className='w-full h-full object-cover object-left-top mx-auto'
				/>
			</div>
		</div>
	);
}
