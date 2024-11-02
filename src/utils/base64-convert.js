function base64Converter(file) {

	if (!(file instanceof File)) {
		return null;
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const base64 = reader.result;
			resolve({ fileName: file.name, base64 });
		};
		reader.onerror = (error) => {
			reject(error);
		};

		reader.readAsDataURL(file);
	});
}

export { base64Converter };