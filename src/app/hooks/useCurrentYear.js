"use client";

import { useEffect, useState } from "react";

export function useCurrentYear() {
	const [year, setYear] = useState("2024");

	useEffect(() => {
		setYear(new Date().getFullYear().toString());
	}, []);

	return year;
}
