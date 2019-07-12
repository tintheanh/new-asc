export interface tinyScheduleProps {
	day: string;
	segments?: ({
		from: string;
		to: string;
	} | null)[];
}
