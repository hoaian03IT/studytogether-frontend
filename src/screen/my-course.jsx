import React, { useContext, useState } from "react";
import OwnCourse from "../screen/mycourse-own";
import FinishedCourse from "../screen/mycourse-finished";
import UnfinishedCourse from "../screen/mycourse-unfinished";
import { Tabs, Tab } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { TranslationContext } from "../providers/TranslationProvider";

const MyCourse = () => {
	const [activeTab, setActiveTab] = useState("own");

	const { translation } = useContext(TranslationContext);

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Tabs container */}
			<div className="flex items-center justify-center py-8">
				<div className="w-full max-w-md">
					<Tabs onSelectionChange={(key) => setActiveTab(key)}>
						<Tab key="own" title={translation("my-course.title-own-course")} />
						<Tab key="unfinished" title={translation("my-course.title-unfinished-course")} />
						<Tab key="finished" title={translation("my-course.title-finished-course")} />
					</Tabs>
				</div>
			</div>

			{/* Content container */}
			<div>
				{activeTab === "own" && <OwnCourse />}
				{activeTab === "unfinished" && <UnfinishedCourse />}
				{activeTab === "finished" && <FinishedCourse />}
			</div>
		</div>
	);
};

export default MyCourse;
