export type Question = {
	id: number;
	text: string;
	choices: string[];
	correctIndex: number;
	runs: 1 | 2 | 4 | 6 | 0;
	type?: "normal" | "wide" | "noball";
	toughness?: number;
};

export const QUESTIONS: Question[] = [
	{ id: 1, text: "What is 7 × 8?", choices: ["54", "56", "58", "60"], correctIndex: 1, runs: 4, toughness: 1 },
	{ id: 2, text: "What is 12 ÷ 3?", choices: ["3", "4", "5", "6"], correctIndex: 1, runs: 2, toughness: 1 },
	{ id: 3, text: "What is the square of 9?", choices: ["81", "72", "99", "79"], correctIndex: 0, runs: 4, toughness: 1 },
	{ id: 4, text: "What is 15 + 26?", choices: ["41", "39", "40", "42"], correctIndex: 2, runs: 2, toughness: 1 },
	{ id: 5, text: "What is 45 − 27?", choices: ["18", "17", "20", "16"], correctIndex: 0, runs: 1, toughness: 1 },
	{ id: 6, text: "Simplify: 5² + 2³", choices: ["33", "31", "29", "25"], correctIndex: 1, runs: 4, toughness: 2 },
	{ id: 7, text: "Find 25% of 200", choices: ["25", "40", "50", "60"], correctIndex: 2, runs: 2, toughness: 1 },
	{ id: 8, text: "What is the cube of 3?", choices: ["9", "18", "27", "36"], correctIndex: 2, runs: 4, toughness: 2 },
	{ id: 9, text: "Simplify: (6 × 2) + (4 ÷ 2)", choices: ["14", "12", "10", "16"], correctIndex: 0, runs: 2, toughness: 1 },
	{ id: 10, text: "Find x if 2x = 14", choices: ["6", "7", "8", "9"], correctIndex: 1, runs: 1, toughness: 1 },

	{ id: 11, text: "What is 3/5 of 100?", choices: ["50", "55", "60", "65"], correctIndex: 2, runs: 4, toughness: 1 },
	{ id: 12, text: "Simplify: 18 ÷ (3 × 2)", choices: ["6", "3", "2", "4"], correctIndex: 1, runs: 2, toughness: 1 },
	{ id: 13, text: "What is the square root of 81?", choices: ["7", "8", "9", "10"], correctIndex: 2, runs: 2, toughness: 1 },
	{ id: 14, text: "If x = 5, find 2x + 3", choices: ["13", "12", "15", "10"], correctIndex: 0, runs: 2, toughness: 1 },
	{ id: 15, text: "What is 8 × 12?", choices: ["88", "92", "96", "98"], correctIndex: 2, runs: 4, toughness: 1 },
	{ id: 16, text: "Find missing term: 2, 4, 8, 16, ?", choices: ["20", "24", "30", "32"], correctIndex: 3, runs: 4, toughness: 2 },
	{ id: 17, text: "Simplify: 3(2 + 5)", choices: ["15", "18", "21", "24"], correctIndex: 0, runs: 2, toughness: 1 },
	{ id: 18, text: "Convert 0.25 to fraction", choices: ["1/2", "1/4", "2/5", "1/5"], correctIndex: 1, runs: 1, toughness: 1 },
	{ id: 19, text: "If 5 pencils cost ₹20, cost of 1 pencil is?", choices: ["₹4", "₹5", "₹3", "₹2"], correctIndex: 0, runs: 1, toughness: 1 },
	{ id: 20, text: "Simplify: (7 × 3) − (8 ÷ 2)", choices: ["19", "17", "20", "18"], correctIndex: 1, runs: 2, toughness: 2 },

	{ id: 21, text: "Find 10% of 350", choices: ["30", "35", "40", "45"], correctIndex: 1, runs: 1, toughness: 1 },
	{ id: 22, text: "If perimeter of a square = 24, find side", choices: ["4", "5", "6", "8"], correctIndex: 2, runs: 2, toughness: 2 },
	{ id: 23, text: "Area of rectangle 5×8?", choices: ["30", "35", "40", "45"], correctIndex: 2, runs: 4, toughness: 1 },
	{ id: 24, text: "Simplify: (9² − 7²)", choices: ["28", "32", "36", "44"], correctIndex: 1, runs: 4, toughness: 2 },
	{ id: 25, text: "If 3x = 21, find x", choices: ["6", "7", "8", "9"], correctIndex: 1, runs: 2, toughness: 1 },
	{ id: 26, text: "Simplify: (2³ × 3²)", choices: ["36", "48", "64", "72"], correctIndex: 0, runs: 4, toughness: 2 },
	{ id: 27, text: "Find the mean of 3, 5, 7", choices: ["4", "5", "6", "7"], correctIndex: 2, runs: 2, toughness: 1 },
	{ id: 28, text: "What is 15% of 200?", choices: ["25", "30", "35", "40"], correctIndex: 1, runs: 2, toughness: 1 },
	{ id: 29, text: "If 8x = 64, x =", choices: ["6", "7", "8", "9"], correctIndex: 2, runs: 1, toughness: 1 },
	{ id: 30, text: "Simplify: (10² ÷ 5)", choices: ["10", "15", "20", "25"], correctIndex: 2, runs: 6, toughness: 2 },
];

