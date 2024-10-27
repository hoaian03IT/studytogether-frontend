class ValidationForm {
    email(value) {
        const emailRegex = /^(?=.{1,254}$)[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
    }

    password(value) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,68}$/;
        return passwordRegex.test(value);
    }

    username(value) {
        const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
        return usernameRegex.test(value);
    }
}

const validationForm = new ValidationForm();
export { validationForm };