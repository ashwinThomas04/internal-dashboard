import TextInput from "./textInput";
import { InputBoxProps } from "./input";
import PasswordInput from "./passwordInput";
import SearchInput from "./searchInput";
import SelectInput from "./selectInput";
import PhoneInput from "./phoneInput";

const input = {
    "text": TextInput,
    "phone": PhoneInput,
    "password": PasswordInput,
    "search": SearchInput,
    "select": SelectInput
}

const InputBox = ({ inputType, ...rest }: InputBoxProps) => {
    const SelectedInput = input[inputType];
    return <SelectedInput {...rest} />
}

export default InputBox;