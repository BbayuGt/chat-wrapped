'use client'
import RedFlag from "@/components/RedFlag";
import Word from "@/components/Word";
import { Card, CardBody, CardHeader } from "@heroui/react";
import moment from "moment";
import {useEffect, useState} from "react";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

export default function Wrapped() {
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
	const storage = window.sessionStorage.getItem("result");
	if (storage) {
	  setResult(JSON.parse(storage));
	}
  }, []);

  if (!result) return <div>Loading...</div>;


  return (
	  <main>
	  	<Card>
			<CardHeader className="justify justify-center">
				<h1 className="text-3xl font-semibold">Chat Wrapped</h1>
			</CardHeader>
			<CardBody>
				<div className="columns-2">
					<Card className="mb-3"> {/* Message Count */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Message Count</h2>
						</CardHeader>
						<CardBody className="grid grid-cols-2">
							<div>
								<p className="text-sm">You</p>
								<p className="text-3xl">{result.data.messageCount.you || "0"}</p>
							</div>
							<div className="text-right">
								<p className="text-sm">Her</p>
								<p className="text-3xl">{result.data.messageCount.her || "0"}</p>
							</div>
						</CardBody>
					</Card>
					<Card className="mb-3"> {/* Average Response Time */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Average Response Time</h2>
						</CardHeader>
						<CardBody className="grid grid-cols-2">
							<div>
								<p className="text-sm">You</p>
								<p className="text-3xl">{moment().add(result.data.averageResponseTime.you, "s").fromNow(true)}</p>
							</div>
							<div className="text-right">
								<p className="text-sm">Her</p>
								<p className="text-3xl">{moment().add(result.data.averageResponseTime.her, "s").fromNow(true)}</p>
							</div>
						</CardBody>
					</Card>
					<Card className="mb-3"> {/* Interest Level */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Interest Level</h2>
						</CardHeader>
						<CardBody className="grid grid-cols-2 gap-2">
							<div>
								<p className="text-sm">You</p>
								<CircularProgressbar className="height-[50%]" circleRatio={0.5} styles={buildStyles({rotation: -.25})} value={100} text="100%" />
							</div>
							<div className="text-right">
								<p className="text-sm">Her</p>
								<CircularProgressbar className="height-[50%]" circleRatio={0.5} styles={buildStyles({rotation: -.25})} value={100} text="100%" />
							</div>
						</CardBody>
					</Card>
					<Card className="mb-3"> {/* Compliment Count */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Compliment Count</h2>
						</CardHeader>
						<CardBody className="grid grid-cols-2">
							<div>
								<p className="text-sm">You</p>
								<p className="text-3xl">10</p>
							</div>
							<div className="text-right">
								<p className="text-sm">Her</p>
								<p className="text-3xl">10</p>
							</div>
						</CardBody>
					</Card>
					<Card className="mb-3"> {/* Red Flags */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Red Flags</h2>
						</CardHeader>
						<CardBody className="gap-3">
						<RedFlag emoji="🚩" text="You said 'I love you' after 1 day" />
						<RedFlag emoji="🚩" text="You said 'I love you' after 1 day" />
						<RedFlag emoji="🚩" text="You said 'I love you' after 1 day" />
						</CardBody>
					</Card>
					<Card className="mb-3"> {/* Top Used Words */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Top Used Words (Her)</h2>
						</CardHeader>
						<CardBody className="">
							{result.data.mostUsedWords.her.slice(0, 5).map((word: {word: string, amount: number}) => (
								<Word key={word.word} word={word.word} amount={word.amount} />
							))}
						</CardBody>
					</Card>
					<Card className="mb-3"> {/* Top Used Words */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Top Used Words (You)</h2>
						</CardHeader>
						<CardBody className="">
						{result.data.mostUsedWords.you.slice(0, 5).map((word: {word: string, amount: number}) => (
							<Word key={word.word} word={word.word} amount={word.amount} />
						))}
						</CardBody>
					</Card>
					<Card className="mb-3"> {/* Attachment Style */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Attachment Style</h2>
						</CardHeader>
						<CardBody className="grid grid-cols-2">
							<div>
								<p className="text-sm">You</p>
								<p className="text-3xl">Secure</p>
							</div>
							<div className="text-right">
								<p className="text-sm">Her</p>
								<p className="text-3xl">Secure</p>
							</div>
						</CardBody>
					</Card>
					<Card className="mb-3"> {/* Msg/mo */}
						<CardHeader>
							<h2 className="text-lg font-semibold">Msg/mo</h2>
						</CardHeader>
						<CardBody className="grid grid-cols-2">
							<div>
								<p className="text-sm">You</p>
								<p className="text-3xl">100</p>
							</div>
							<div className="text-right">
								<p className="text-sm">Her</p>
								<p className="text-3xl">100</p>
							</div>
						</CardBody>
					</Card>
				</div>
			</CardBody>
		</Card>
	  </main>
  );
}
