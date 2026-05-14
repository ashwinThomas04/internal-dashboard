export const range = (a=1, b?:number):number => {
	const min = b === undefined ? 0 : a;
	const max = b === undefined && a===undefined ? 0:b === undefined? a : b;
	return Math.random() * (max - min) + min;
}

export const rangeFloor = (a=1, b?:number):number => {
	return Math.floor(range(a, b));
}