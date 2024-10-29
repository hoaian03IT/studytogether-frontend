import { Feedback } from "./feedback.jsx";

function CourseInformationFeedback() {
	return <div>
		<h2 className="text-xl font-bold">Comments(1)</h2>
		<div className="mt-8">
			<Feedback name="Richard Ronal"
					  avatar="https://img.freepik.com/free-photo/medium-shot-boy-relaxing-nature_23-2150753072.jpg"
					  comment="Maecenas risus tortor, tincidunt nec purus eu, gravida suscipit tortor."
					  createdAt={Date("10/20/2024")}
					  role="admin"
			/>
		</div>

	</div>;
}

export { CourseInformationFeedback };