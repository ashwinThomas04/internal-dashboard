type ValidationResponse = {
    isValid: boolean,
    message?: string
}

const EMAIL_LENGTH_MAX = 320;
const NAME_LENGTH_MAX = 50

const EMAIL_PATTERN = /^\w+([\+\.-]?\w+)*@\w+([\.-]?\w{1,63})*(\.\w{2,63})+$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*]).{6,40}$/;
const NAME_PATTERN = /^(([a-zA-Z\u0600-\u06FF])+([ a-zA-Z\u0600-\u06FF]*)){1,50}$/;
const PHONE_PATTERN = /^\d{9,10}$/;
const OTP_PATTERN = /^\d{4}$/;

export class ValidationService {
    constructor() { }

    /* Email address Validation */
    isEmail(val: string): ValidationResponse {
        if (!val) return { isValid: false, message: "Email not provided! Please enter a valid email" };
        if (val.length > EMAIL_LENGTH_MAX) return { isValid: false, message: "Email is too long! Please enter a valid email" };
        if (!EMAIL_PATTERN.test(val)) return { isValid: false, message: "Invalid email format! Please enter a valid email" };
        return { isValid: true };
    }

    /* Password field Validation */
    isPassword(val: string): ValidationResponse {
        if (!val) return { isValid: false, message: "Password not provided! Please enter a valid password" };
        if (PASSWORD_PATTERN.test(val)) return { isValid: true };
        else return { isValid: false, message: "Invalid password format! Please enter a valid password" };
    }

    /* Name validation */
    isName(val: string): ValidationResponse {
        if (!val) return { isValid: false, message: "Name not provided! Please enter a valid name" };
        if (val.length > NAME_LENGTH_MAX) return { isValid: false, message: "Name is too long! Please enter a valid name" };
        if (!NAME_PATTERN.test(val)) return { isValid: false, message: "Invalid name format! Please enter a valid name" };
        return { isValid: true };
    }

    /* Phone Number Validation */
    isPhone(val: string): ValidationResponse {
        if (!val) return { isValid: false, message: "Phone number not provided! Please enter a valid phone number" };
        if (!PHONE_PATTERN.test(val)) return { isValid: false, message: "Invalid phone number format! Please enter a valid phone number" };
        return { isValid: true };
    }

    isOtp(val: string): ValidationResponse {
        if (!val) return { isValid: false, message: "OTP not provided! Please enter a valid OTP" };
        if (!OTP_PATTERN.test(val)) return { isValid: false, message: "Invalid OTP format! Please enter a valid OTP" };
        return { isValid: true };
    }
}

export const validationService = new ValidationService();