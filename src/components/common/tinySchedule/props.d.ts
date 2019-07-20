export interface tinyScheduleProps {
	day: string;
	data: ({
		from: {
			time: string;
		};
		to: { time: string };
	})[];
}
