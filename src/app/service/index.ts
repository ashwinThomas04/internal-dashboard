import { messageService, MessageService } from "./classes/messages";
import { validationService, ValidationService } from "./classes/validation";
import { deviceManager } from "./classes/deviceManager";

const services = {
    messageService,
    validationService,
    deviceManager
}

export default services;
export { MessageService, ValidationService }