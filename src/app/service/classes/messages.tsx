type HttpErrorCode=|400|401|403|404|408|429|500|502|503|504;
type ErrorMessageKey = HttpErrorCode | "DEFAULT";
type ErrorMessageMap = Record<ErrorMessageKey, string>;

const ERROR_MESSAGES: ErrorMessageMap = {
  400: "We couldn't process your request. Please check the details and try again.",
  401: "You're not signed in. Please log in to continue.",
  403: "You don't have permission to access this.",
  404: "We couldn't find what you're looking for.",
  408: "This is taking longer than expected. Please try again.",
  429: "You've made too many requests. Please slow down and try again shortly.",
  500: "Something went wrong on our end. Please try again later.",
  502: "We're having trouble reaching the server. Please try again.",
  503: "The service is temporarily unavailable. Please try again soon.",
  504: "The server is taking too long to respond. Please try again.",
  "DEFAULT":"We're having some trouble right now. Please try again in a moment." 
};

export class MessageService{
    private readonly error: ErrorMessageMap;
    constructor(errorMessaages: ErrorMessageMap){
        this.error=errorMessaages
    }

    getApiErrorMessage(code?:number|"DEFAULT"){
        const message=code? this.error[code as HttpErrorCode]:this.error["DEFAULT"];
        if(message) return message;
        else return this.error["DEFAULT"];
    }

    getEmptyFieldError(field:"email"|"password"|"name"|string){
        return `Oops, looks like you missed the ${field}. Please enter it to continue.`
    }

    getInvalidFieldError(field:"email"|"password"|"name"|string){
        return `Oops, looks like you entered an invalid ${field}. Please use a valid format.`
    }
}

export const messageService = new MessageService(ERROR_MESSAGES);