import { Accordion, AccordionItem, Checkbox, CircularProgress, Divider } from "@nextui-org/react";
import { useState } from "react";
import { BsBookmark, BsCollection, BsStopwatch } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api.js";

function CourseInformationContent({ courseId }) {
	const [completed, setCompleted] = useState(15);

	const courseContentQuery = useQuery({
		queryKey: ["course-content", courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CourseService.fetchCourseContent(queryKey[1]);
			} catch (error) {
				console.error(error);
			}
		},
	});

	return <div>
		<div className="flex items-center justify-between">
			<h2 className="text-xl font-bold">Course content</h2>
		</div>
		{courseContentQuery.isLoading ?
			<div className="flex justify-center"><CircularProgress label="Loading..." /></div> :
			<div className="bg-white mt-10">
				<div className="flex items-center text-sm p-2">
					<p className="flex-1 font-normal text-secondary text-xl">Course collections</p>
					<span className="flex items-center ml-4 text-gray-500"><BsCollection
						className="mr-1 size-6 text-purple-500" /> {courseContentQuery.data?.levels.length} collections</span>
					<span className="flex items-center ml-4 text-gray-500"><BsStopwatch
						className="mr-1 size-6 text-yellow-500" /> 300m</span>
				</div>
				<Divider />
				<Accordion className="rounded-md">
					{
						courseContentQuery.data?.levels.map(level => {

							return <AccordionItem
								key={level["levelId"]} aria-label="Accordion 1"
								title={<div className="flex items-center text-base">
									<span className="text-base">{level["levelName"]}</span>
									<div className="flex-1 flex items-center justify-end text-secondary">
										<BsBookmark className="size-4 text-secondary" /> {level.words.length} words
									</div>
								</div>
								}>
								<ul>
									{level.words.map(word =>
										<li key={word["word id"]} className="flex items-center py-2 pl-8 pr-4">
											<Checkbox color="secondary" radius="none" isSelected />
											<span className="ms-5">{word["word"]}:&emsp;{word["definition"]}</span>
										</li>)}
								</ul>
							</AccordionItem>;
						})
					}
				</Accordion>
			</div>}
	</div>;
}

export { CourseInformationContent };