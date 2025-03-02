import {Message} from "@/app/read-text/page";
import moment, {Moment} from "moment";
import {NextApiRequest, NextApiResponse} from "next";
import {NextRequest} from "next/server";

function calculateReceiverResponseTime(text: Message[], owner: string): number {
	const messages = text.filter((message) => message.sender !== owner);
	const responseTimes = messages.map((message, index) => {
		if (index === 0) return 0;
		const previousMessage = messages[index - 1];
		const diff = moment(message.date).diff(previousMessage.date, "seconds");
		return diff;
	});
	const average = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
	return average;
}

function calculateSenderResponseTime(text: Message[], owner: string): number {
	const messages = text.filter((message) => message.sender === owner);
	const responseTimes = messages.map((message, index) => {
		if (index === 0) return 0;
		const previousMessage = messages[index - 1];
		const diff = moment(message.date).diff(previousMessage.date, "seconds");
		return diff;
	});
	const average = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
	return average;
}

function calculateTopMostUsedWordsFromReceiver(text: Message[], owner: string): {word: string, amount: number}[] {
	const messages = text.filter((message) => message.sender !== owner);
	const words = messages.map((message) => message.message.split(" ")).flat();
	const wordCount = words.reduce((acc, word) => {
		if (!acc[word]) acc[word] = 0;
		acc[word]++;
		return acc;
	}, {} as Record<string, number>);
	const sorted = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
	return sorted.filter(x=>x[1] >= 10).map(([word, amount]) => ({word, amount}));
}

function calculateTopMostUsedWordsFromSender(text: Message[], owner: string): {word: string, amount: number}[] {
	const messages = text.filter((message) => message.sender === owner);
	const words = messages.map((message) => message.message.split(" ")).flat();
	const wordCount = words.reduce((acc, word) => {
		if (!acc[word]) acc[word] = 0;
		acc[word]++;
		return acc;
	}, {} as Record<string, number>);
	const sorted = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
	return sorted.filter(x =>x[1] >= 10).map(([word, amount]) => ({word, amount}));
}

function calculateMessagePerMonthRecipier(text: Message[], owner: string): {month: string, amount: number}[] {
	const messages = text.filter((message) => message.sender !== owner);
	const months = messages.map((message) => moment(message.date).format("MMMM"));
	const monthCount = months.reduce((acc, month) => {
		if (!acc[month]) acc[month] = 0;
		acc[month]++;
		return acc;
	}, {} as Record<string, number>);
	const sorted = Object.entries(monthCount).sort((a, b) => b[1] - a[1]);
	return sorted.map(([month, amount]) => ({month, amount}));
}

function calculateMessagePerMonthSender(text: Message[], owner: string): {month: string, amount: number}[] {
	const messages = text.filter((message) => message.sender === owner);
	const months = messages.map((message) => moment(message.date).format("MMMM"));
	const monthCount = months.reduce((acc, month) => {
		if (!acc[month]) acc[month] = 0;
		acc[month]++;
		return acc;
	}, {} as Record<string, number>);
	const sorted = Object.entries(monthCount).sort((a, b) => b[1] - a[1]);
	return sorted.map(([month, amount]) => ({month, amount}));
}

export async function POST(request: NextRequest, response: NextApiResponse) {
	const body = await request.json();
	const owner = body.owner;
	const result =  {
		status: "success",
		data: {
			messageCount: {
				you: body.text.filter((message: any) => message.sender === owner).length,
				her: body.text.filter((message: any) => message.sender !== owner).length,
			},
			averageResponseTime: {
				you: calculateSenderResponseTime(body.text, owner),
				her: calculateReceiverResponseTime(body.text, owner),
			},
			mostUsedWords: {
				you: calculateTopMostUsedWordsFromSender(body.text, owner),
				her: calculateTopMostUsedWordsFromReceiver(body.text, owner),
			},
			messagePerMonth: {
				you: calculateMessagePerMonthSender(body.text, owner),
				her: calculateMessagePerMonthRecipier(body.text, owner),
			},
		}
	}
	return Response.json(result);
}
