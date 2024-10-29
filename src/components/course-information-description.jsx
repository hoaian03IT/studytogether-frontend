function CourseInformationDescription({ shortDescription, detailedDescription }) {
	return <div>
		<p className="font-bold">{shortDescription}</p>
		<p className="mt-2 text-sm">{detailedDescription}</p>
	</div>;
}

export { CourseInformationDescription };