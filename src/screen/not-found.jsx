import { FaHome } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import { pathname } from "../routes";

export default function NotFound() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
			<div className='max-w-md w-full bg-white shadow-2xl rounded-xl p-8 text-center'>
				<div className='mb-6'>
					<h1 className='text-6xl font-bold text-indigo-600 mb-4'>404</h1>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>Oops! Page Not Found</h2>
					<p className='text-gray-600 mb-6'>
						It seems you've wandered off the learning path. Let's get you back on track!
					</p>
				</div>

				<div className='space-y-4'>
					<Link
						to={pathname.home}
						className='w-full flex items-center justify-center bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out'>
						<FaHome className='mr-2' size={20} />
						Return to Home
					</Link>

					<button
						onClick={() => window.location.reload()}
						className='w-full flex items-center justify-center bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out'>
						<FiRefreshCw className='mr-2' size={20} />
						Refresh Page
					</button>
				</div>

				<div className='mt-8 text-sm text-gray-500'>
					<p>Looks like this page does not exist!</p>
					<p>Try searching again or explore our learning resources.</p>
				</div>
			</div>
		</div>
	);
}
