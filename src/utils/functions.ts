import { Schedule } from 'config';

export const getEpochOfTime = (d: Date): number => {
	return Math.floor(d.getTime() / 1000);
};

export const getEpochOfDate = (d: Date): number => {
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();

	const date = new Date(year, month, day);

	return getEpochOfTime(date);
};

export const getDateFromUnix = (unix_time: number): string => {
	const d = new Date(unix_time * 1000);
	const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
	const year = d.getFullYear();
	const month = months[d.getMonth()];
	const day = d.getDate();
	const date = `${day} ${month}, ${year}`;
	return date;
};

export const getTimeFromUnix = (unix_time: number): string => {
	const d = new Date(unix_time * 1000);
	const time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
	return time;
};

export const timeDiff = (time1: number, time2: number): string => {
	let difference = Math.abs(time2 - time1);

	const hoursDifference = Math.floor(difference / 60 / 60);
	difference -= hoursDifference * 60 * 60;

	const minutesDifference = Math.floor(difference / 60);
	difference -= minutesDifference * 60;

	if (hoursDifference === 0 && minutesDifference !== 0) {
		return `${minutesDifference} minutes`;
	}

	if (minutesDifference === 0 && hoursDifference !== 0) {
		return `${hoursDifference} hours`;
	}

	if (minutesDifference === 0 && hoursDifference === 0) {
		return `${minutesDifference} minutes`;
	}

	return `${hoursDifference} hours ${minutesDifference} minutes`;
};

export const secondsToHms = (d: number) => {
	const h = Math.floor(d / 3600);
	const m = Math.floor((d % 3600) / 60);

	const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '0 hour ';
	const mDisplay = m > 0 ? m + (m == 1 ? ' minute' : ' minutes ') : '0 minute';

	return hDisplay + mDisplay;
};

export const contains = (arr: any[] | null, obj: any, key: string, nestedKey?: string): boolean => {
	if (!nestedKey) {
		if (arr) {
			if (arr.filter((e) => obj[key] === e[key]).length) return true;
			return false;
		}
		return false;
	} else {
		if (arr) {
			if (arr.filter((e) => obj[key][nestedKey] === e[key][nestedKey]).length) return true;
			return false;
		}
		return false;
	}
};

export const arraySort = (arr: any[] | null, property: string, nested?: string): any[] | [] => {
	if (!nested) {
		if (arr) return arr.sort((a, b) => (a[property] > b[property] ? 1 : b[property] > a[property] ? -1 : 0));
		return [];
	} else {
		if (arr)
			return arr.sort(
				(a, b) =>
					a[property][nested] > b[property][nested] ? 1 : b[property][nested] > a[property][nested] ? -1 : 0
			);
		return [];
	}
};

export const preprocessWorkScheduleBeforeUpdate = (work_schedule: Schedule[][]) => {
	return work_schedule.map((sch) => {
		if (sch.length) {
			const each = sch.map((hr, i) => ({
				[i]: {
					from: { time: hr.from.time, order: hr.from.order },
					to: { time: hr.to.time, order: hr.to.order }
				}
			}));
			const newObj = Object.assign({}, ...each);
			return newObj;
		}
		return null;
	});
};

export const chunk = (array: any[], size: number) => {
	const chunked_arr = [];
	let index = 0;
	while (index < array.length) {
		chunked_arr.push(array.slice(index, size + index));
		index += size;
	}
	return chunked_arr;
};

export const processDataForReportPage = (
	array: any[],
	property: string,
	propertyUnited: string,
	numberOfPiece: number
) => {
	const dataWithIds = array.map((tutor: any) => {
		return tutor[propertyUnited].map((pieceOfData: any) => ({
			uid: tutor.uid,
			[property]: pieceOfData
		}));
	});
	console.log(dataWithIds);
	const flatted = dataWithIds.flat();
	const chunked = chunk(flatted, numberOfPiece);
	const results = chunked.map((ch: any) => {
		const group_to_values = ch.reduce((obj: any, item: any) => {
			obj[item.uid] = obj[item.uid] || [];
			obj[item.uid].push(item[property]);
			return obj;
		}, {});

		const groups = Object.keys(group_to_values).map((key: any) => {
			const tutor = array.filter((tt: any) => tt.uid === key)[0];
			return { ...tutor, [propertyUnited]: group_to_values[key] };
		});
		return groups;
	});

	return results;
};
