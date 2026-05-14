import { useEffect } from "react";
import { useConfig } from "./context";

const Initialiser = () => {
	const { updateBrandConfig } = useConfig();

	useEffect(() => {
		updateBrandConfig({ c: null });;
	}, []);

	return null;
}

export default Initialiser;