import { Button } from "@nextui-org/react";

const SidebarListExercise = ({ levels, selectedLevels, setSelectedLevels }) => {
	const handleSelect = (value) => {
		if (selectedLevels === value) {
			setSelectedLevels(null);
		} else {
			setSelectedLevels(value);
		}
	};
	return (
		<div className="h-full w-full flex flex-col gap-4 p-4 rounded-small bg-white shadow-md border-1 border-gray-200">
			<div className="bg-light-blue-300 p-3 border rounded-lg">
				<p className="text-center">Levels/Collections</p>
			</div>
			<div className="flex flex-col gap-2">
				{levels?.map((item) => {
					return (
						<Button
							variant={selectedLevels === item?.["level id"] ? "bordered" : "flat"}
							color={selectedLevels === item?.["level id"] ? "primary" : "default"}
							onClick={() => handleSelect(item?.["level id"])}
							key={item?.["level id"]}
							size="lg"
							radius="sm">
							<p className="text-base font-semibold">{item?.["level name"]}</p>
						</Button>
					);
				})}
			</div>
		</div>
	);
};

export { SidebarListExercise };
