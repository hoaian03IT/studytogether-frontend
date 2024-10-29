import { Accordion, AccordionItem, Checkbox, Divider, Progress } from "@nextui-org/react";
import { useState } from "react";
import { BsBookmark, BsCheck2All, BsCollection, BsStopwatch } from "react-icons/bs";

function CourseInformationContent() {
	const [completed, setCompleted] = useState(15);
	return <div>
		<div className="flex items-center justify-between">
			<h2 className="text-xl">Course content</h2>
			<span className="text-success">{completed}% Completed</span>
		</div>
		<Progress className="mt-4" color="success" aria-label="completed" value={15} radius="none" size="md" />
		<div className="bg-white mt-10">
			<div className="flex items-center text-sm p-2">
				<p className="flex-1 font-normal text-secondary text-xl">Course collections</p>
				<span className="flex items-center ml-4 text-gray-500"><BsCollection
					className="mr-1 size-6 text-purple-500" /> 21 collections</span>
				<span className="flex items-center ml-4 text-gray-500"><BsStopwatch
					className="mr-1 size-6 text-yellow-500" /> 300m</span>
				<span className="flex items-center ml-4 text-gray-500"><BsCheck2All
					className="mr-1 size-6 text-green-500" /> {completed}% finished (1/4)</span>
			</div>
			<Divider />
			<Accordion>
				<AccordionItem key="1" aria-label="Accordion 1" title={<div className="flex items-center text-base">
					<span
						className="text-base">Animals </span>
					<div className="flex-1 flex items-center justify-end text-secondary">
						<BsBookmark className="size-4 text-secondary" /> 10 words
					</div>
				</div>
				}>
					<ul>
						<li className="flex items-center py-2 pl-8 pr-4">
							<Checkbox color="secondary" radius="none" isSelected />
							<span>A pig: &emsp;Con heo</span>
						</li>
						<Divider />
						<li className="flex items-center py-2 pl-8 pr-4">
							<Checkbox color="secondary" radius="none" isSelected />
							<span>A pig: &emsp;Con heo</span>
						</li>
						<Divider />
						<li className="flex items-center py-2 pl-8 pr-4">
							<Checkbox color="secondary" radius="none" isSelected />
							<span>A pig: &emsp;Con heo</span>
						</li>
					</ul>
				</AccordionItem>
				<AccordionItem key="2" aria-label="Accordion 2" title={<span className="text-base">Vehicles</span>}>
				</AccordionItem>
				<AccordionItem key="3" aria-label="Accordion 3" title={<span className="text-base">Plants</span>}>
				</AccordionItem>
			</Accordion>
		</div>
	</div>;
}

export { CourseInformationContent };