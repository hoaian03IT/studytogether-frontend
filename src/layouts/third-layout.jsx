import CourseBar from "../components/course-bar";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { SidebarMain } from "../components/sidebar-main";

const ThirdLayout = ({ children }) => {
	return (
		<div className="w-screen flex h-dvh">
			<div className="sticky top-0 bottom-0 flex-shrink-0 flex-grow-0 basis-auto">
				<SidebarMain />
			</div>
			<main className="flex-1 flex w-full overflow-x-hidden">
				<div className="flex-1 flex flex-col">
					<Header fluid />
					<div className="p-4">
						<div className="flex justify-center">
							<CourseBar />
						</div>
					</div>
					<div className="flex-1 p-4">{children}</div>
					<Footer />
				</div>
			</main>
		</div>
	);
};

export default ThirdLayout;
