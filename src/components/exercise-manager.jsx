import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	Tab,
	Tabs,
} from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { forwardRef, Fragment, useImperativeHandle, useState } from "react";
import { base64Converter } from "../utils/base64-convert.js";
import { toast } from "react-toastify";
import { ImageAndAudio } from "./audio-and-image.jsx";
import { SelectItem } from "@nextui-org/select";

const difficulties = [
	{ key: "easy", title: "Easy", color: "success" },
	{ key: "medium", title: "Medium", color: "warning" },
	{ key: "hard", title: "Hard", color: "danger" }];

export const ExerciseManager = forwardRef(({ isOpen, onClose, isLoading, action = "insert", handleSubmit }, ref) => {
	const [typeQuestion, setTypeQuestion] = useState("multiple-choices");
	const [difficulty, setDifficulty] = useState(difficulties[0]?.key);
	const [formValueMultipleChoices, setFormValueMultipleChoices] = useState({
		question: "", answer: "A", optionA: "", optionB: "", optionC: "", optionD: "", explanation: "",
		image: "", audio: "", title: "",
	});
	const [formValueFillInBlank, setFormValueFillInBlank] = useState({
		question: "", answer: "", explanation: "", image: "", audio: "", title: "",
	});
	const [showMore, setShowMore] = useState({
		multipleChoices: false,
		fillInBlank: false,
	});

	useImperativeHandle(ref, () => {
		return {
			getFormValueMultipleChoices() {
				return formValueMultipleChoices;
			},
			getFormValueFillInBlank() {
				return formValueFillInBlank;
			},
			getTypeQuestion() {
				return typeQuestion;
			},
			getDifficulty() {
				return difficulty;
			},
			setDifficulty(value) {
				setDifficulty(value);
			},
			setTypeQuestion(type) {
				setTypeQuestion(type);
			},
			setQuestionMultipleChoices(question) {
				setFormValueMultipleChoices(prev => ({ ...prev, question: question }));
			},
			setAnswerMultipleChoices(answer) {
				setFormValueMultipleChoices(prev => ({ ...prev, answer: answer }));
			},
			setOptionAMultipleChoices(value) {
				setFormValueMultipleChoices(prev => ({ ...prev, optionA: value }));
			},
			setOptionBMultipleChoices(value) {
				setFormValueMultipleChoices(prev => ({ ...prev, optionB: value }));
			},
			setOptionCMultipleChoices(value) {
				setFormValueMultipleChoices(prev => ({ ...prev, optionC: value }));
			},
			setOptionDMultipleChoices(value) {
				setFormValueMultipleChoices(prev => ({ ...prev, optionD: value }));
			},
			setImageMultipleChoices(value) {
				setFormValueMultipleChoices(prev => ({ ...prev, image: value }));
				if (value) {
					setShowMore(prev => ({ ...prev, multipleChoices: true }));
				}
			},
			setAudioMultipleChoices(value) {
				setFormValueMultipleChoices(prev => ({ ...prev, audio: value }));
				if (value) {
					setShowMore(prev => ({ ...prev, multipleChoices: true }));
				}
			},
			setTitleMultipleChoices(value) {
				setFormValueMultipleChoices(prev => ({ ...prev, title: value }));
			},
			setExplanationMultipleChoices(explanation) {
				setFormValueMultipleChoices(prev => ({ ...prev, explanation: explanation }));
			}
			, setQuestionFillInBlank(question) {
				setFormValueFillInBlank(prev => ({ ...prev, question: question }));
			},
			setAnswerFillInBlank(answer) {
				setFormValueFillInBlank(prev => ({ ...prev, answer: answer }));
			}, setImageFillInBlank(value) {
				setFormValueFillInBlank(prev => ({ ...prev, image: value }));
				if (value) {
					setShowMore(prev => ({ ...prev, fillInBlank: true }));
				}
			},
			setAudioFillInBlank(value) {
				setFormValueFillInBlank(prev => ({ ...prev, audio: value }));
				if (value) {
					setShowMore(prev => ({ ...prev, fillInBlank: true }));
				}
			},
			setExplanationFillInBlank(explanation) {
				setFormValueFillInBlank(prev => ({ ...prev, explanation: explanation }));
			},
			setTitleFillInBlank(value) {
				setFormValueFillInBlank(prev => ({ ...prev, title: value }));
			},

		};
	}, [formValueFillInBlank, formValueMultipleChoices, difficulty, typeQuestion]);

	const handleOnChangeMultipleChoicesForm = (e) => {
		let { name, value } = e.target;
		setFormValueMultipleChoices(prev => ({ ...prev, [name]: value }));
	};

	const handleOnChangeFillInBlankForm = (e) => {
		let { name, value } = e.target;
		setFormValueFillInBlank(prev => ({ ...prev, [name]: value }));
	};

	const handleSelectFileMedia = async (e) => {
		const { name, files, ariaLabel } = e.target;
		const file = files[0];
		if (name === "image" && file.type.split("/")[0] !== "image") {
			toast.warn("File must be an image");
			return;
		}
		if (name === "audio" && file.type.split("/")[0] !== "audio") {
			toast.warn("File must be an audio");
			return;
		}
		let maxSize = 2; // MB
		if (file.size / (1024 * 1024) <= maxSize) {
			let { base64 } = await base64Converter(file);
			if (ariaLabel === "multiple-choices") {
				setFormValueMultipleChoices(prev => ({ ...prev, [name]: base64 }));
			} else if (ariaLabel === "fill-in-blank") {
				setFormValueFillInBlank(prev => ({ ...prev, [name]: base64 }));
			}
		} else {
			toast.warn(`Image must be smaller than ${maxSize}MB`);
		}
	};

	const handleRemoveFileMediaMultipleChoices = (type) => {
		setFormValueMultipleChoices(prev => ({ ...prev, [type]: "" }));
	};

	const handleRemoveFileMediaFillInBlank = (type) => {
		setFormValueFillInBlank(prev => ({ ...prev, [type]: "" }));
	};

	const handleShowMore = (e, type) => {
		setShowMore({ ...showMore, [type]: !showMore?.[type] });
	};

	return <Modal isOpen={isOpen} onClose={onClose} size="xl">
		<ModalContent>
			<form onSubmit={handleSubmit}>
				<ModalHeader>
					Question Insert
				</ModalHeader>
				<ModalBody>
					<Tabs aria-label="Options" variant="light" selectedKey={typeQuestion}
						  onSelectionChange={action === "edit" ? setTypeQuestion : null}>
						<Tab key="multiple-choices" title="Mutiple choices">
							<div className="space-y-2">
								<div>
									<label className="text-black">Difficulty:</label>
									<Select variant="bordered" radius="sm" color="primary" aria-label="difficulty"
											selectedKeys={[difficulty?.toString()]}
											value={difficulty}
											onChange={e => {
												setDifficulty(e.target.value);
											}}>
										{difficulties.map(difficulty => <SelectItem key={difficulty.key}
																					color={difficulty.color}>{difficulty.title}</SelectItem>)}
									</Select>
								</div>
								<div>
									<label className="text-black">Title:</label>
									<Input
										name="title" color="primary"
										variant="bordered"
										placeholder="Title text"
										radius="sm" value={formValueMultipleChoices.title}
										onChange={handleOnChangeMultipleChoicesForm}
										size="md" required
										isRequired />
								</div>
								<div>
									<label className="text-black">Question:</label>
									<Textarea
										name="question" color="primary"
										variant="bordered"
										placeholder="Question text"
										radius="sm" value={formValueMultipleChoices.question}
										onChange={handleOnChangeMultipleChoicesForm}
										size="md" rows={3} disableAutosize className="resize-none" required
										isRequired />
								</div>
								<div>
									<label>Answer:</label>
									<div className="grid grid-cols-2 gap-y-2 gap-x-6">
										<div className="col-span-1 flex items-center gap-2">
											<Input name="optionA" variant="bordered" placeholder="Option A"
												   radius="sm" value={formValueMultipleChoices.optionA}
												   onChange={handleOnChangeMultipleChoicesForm} color="primary"
												   size="md" required
												   isRequired />
											<input type="radio" className="flex-1 cursor-pointer"
												   name="answer"
												   value="A"
												   checked={formValueMultipleChoices.answer === "A"}
												   onChange={handleOnChangeMultipleChoicesForm} required />
										</div>
										<div className="col-span-1 flex items-center gap-2">
											<Input name="optionB" variant="bordered" placeholder="Option B"
												   radius="sm" value={formValueMultipleChoices.optionB}
												   onChange={handleOnChangeMultipleChoicesForm} color="primary"
												   size="md" required
												   isRequired />
											<input type="radio" className="flex-1 cursor-pointer"
												   name="answer"
												   value="B"
												   checked={formValueMultipleChoices.answer === "B"}
												   onChange={handleOnChangeMultipleChoicesForm} required />
										</div>
										<div className="col-span-1 flex items-center gap-2">
											<Input name="optionC" variant="bordered" placeholder="Option C"
												   radius="sm" value={formValueMultipleChoices.optionC}
												   onChange={handleOnChangeMultipleChoicesForm} color="primary"
												   size="md" required
												   isRequired />
											<input type="radio" className="flex-1 cursor-pointer"
												   name="answer"
												   value="C"
												   checked={formValueMultipleChoices.answer === "C"}
												   onChange={handleOnChangeMultipleChoicesForm} required />
										</div>
										<div className="col-span-1 flex items-center gap-2">
											<Input name="optionD" variant="bordered" placeholder="Option D"
												   radius="sm" value={formValueMultipleChoices.optionD}
												   onChange={handleOnChangeMultipleChoicesForm} color="primary"
												   size="md" required
												   isRequired />
											<input type="radio" className="flex-1 cursor-pointer"
												   name="answer"
												   value="D"
												   checked={formValueMultipleChoices.answer === "D"}
												   onChange={handleOnChangeMultipleChoicesForm} required />
										</div>
									</div>
								</div>
								<div>
									<label>Explanation:</label>
									<Textarea name="explanation" variant="bordered"
											  placeholder="Explanation text"
											  radius="sm" value={formValueMultipleChoices.explanation}
											  onChange={handleOnChangeMultipleChoicesForm} color="primary"
											  size="md" rows={3} disableAutosize className="resize-none" />
								</div>
								<div>
									<Button size="sm" color="default" aria-label="multipleChoices"
											onClick={e => {
												handleShowMore(e, "multipleChoices");
											}}>{showMore?.multipleChoices ?
										<Fragment>
											<FaMinus className="size-3" radius="sm" />
											<span>Hide</span>
										</Fragment> :
										<Fragment>
											<FaPlus className="size-3" radius="sm" />
											<span>More</span>
										</Fragment>}
									</Button>
									{showMore.multipleChoices &&
										<div className="w-full mt-2">
											<ImageAndAudio audioSrc={formValueMultipleChoices?.audio}
														   handleSelectAudio={handleSelectFileMedia}
														   imageSrc={formValueMultipleChoices?.image}
														   handleSelectImage={handleSelectFileMedia}
														   handleRemoveMedia={handleRemoveFileMediaMultipleChoices}
														   typeExercise="multiple-choices" />
										</div>}
								</div>
							</div>
						</Tab>
						<Tab key="fill-in-blank" title="Fill in blank">
							<div className="space-y-2">
								<div>
									<label className="text-black">Difficulty:</label>
									<Select variant="bordered" radius="sm" color="primary" aria-label="difficulty"
											selectedKeys={[difficulty?.toString()]}
											value={difficulty}
											onChange={e => {
												setDifficulty(e.target.value);
											}}>
										{difficulties.map(difficulty => <SelectItem key={difficulty.key}
																					color={difficulty.color}>{difficulty.title}</SelectItem>)}
									</Select>
								</div>
								<div>
									<label className="text-black">Title:</label>
									<Input
										name="title" color="primary"
										variant="bordered"
										placeholder="Title text"
										radius="sm" value={formValueFillInBlank.title}
										onChange={handleOnChangeFillInBlankForm}
										size="md" required
										isRequired />
								</div>
								<div>
									<label className="text-black">Question:</label>
									<Textarea
										name="question" color="primary"
										variant="bordered"
										placeholder="Question text with blank (use ___)"
										radius="sm" value={formValueFillInBlank.question}
										onChange={handleOnChangeFillInBlankForm}
										required
										isRequired
										size="md" rows={3} disableAutosize className="resize-none" />
								</div>
								<div>
									<label>Answer:</label>
									<Input name="answer" variant="bordered" placeholder="Answer text" radius="sm"
										   size="md" color="primary"
										   value={formValueFillInBlank.answer}
										   onChange={handleOnChangeFillInBlankForm} required
										   isRequired />
								</div>
								<div>
									<label>Explanation:</label>
									<Textarea name="explanation" variant="bordered"
											  placeholder="Explanation text" color="primary"
											  radius="sm" value={formValueFillInBlank.explanation}
											  onChange={handleOnChangeFillInBlankForm}
											  size="md" rows={3} disableAutosize className="resize-none" />
								</div>
								<div>
									<Button size="sm" color="default" aria-label="multipleChoices"
											onClick={e => {
												handleShowMore(e, "fillInBlank");
											}}>{showMore?.fillInBlank ?
										<Fragment>
											<FaMinus className="size-3" radius="sm" />
											<span>Hide</span>
										</Fragment> :
										<Fragment>
											<FaPlus className="size-3" radius="sm" />
											<span>More</span>
										</Fragment>}
									</Button>
									{showMore.fillInBlank && <div className="w-full mt-2">
										<ImageAndAudio audioSrc={formValueFillInBlank?.audio}
													   handleSelectAudio={handleSelectFileMedia}
													   imageSrc={formValueFillInBlank?.image}
													   handleSelectImage={handleSelectFileMedia}
													   handleRemoveMedia={handleRemoveFileMediaFillInBlank}
													   typeExercise="fill-in-blank" />
									</div>}
								</div>
							</div>
						</Tab>
					</Tabs>
				</ModalBody>
				<ModalFooter>
					<Button variant="shadow" color="primary" radius="sm" type="submit" isLoading={isLoading}>
						{action === "insert" ? <Fragment>
							<FaPlus />
							<span>Insert</span>
						</Fragment> : <span>Update</span>}
					</Button>
				</ModalFooter>
			</form>
		</ModalContent>
	</Modal>;
});