"use client";

import {Button} from "@heroui/button";
import {Card, CardBody, CardHeader, DatePicker} from "@heroui/react";
import {parseDate} from "@internationalized/date";
import {redirect} from "next/navigation";
import {useEffect, useState} from "react";

export interface Message {
	date: Date,
	sender: string,
	message: string
}

function extractMessage(text: string, fromDate?: Date):Message[] {
	const regex = /(.*?)  - (.*?): ([\S\s]*?)(?=\n[0-9]*\/[0-9]*\/[0-9]*|$)/g;
	const result = text.matchAll(regex).toArray()


	return result.map((match) => {
		return {
			date: new Date(match[1]),
			sender: match[2],
			message: match[3].toLowerCase()
		}
	}).filter((message) => {
		if (message.message === "<media omitted>") return false
		if (message.message === "null") return false
		if (fromDate && message.date < fromDate) return false
		return true
	} )
}

function getSenderList(messages: Message[]): string[] {
	const senders = messages.map((message) => message.sender)
	return Array.from(new Set(senders))
}

export default function ReadText() {
  const [text, setText] = useState<Message[] | null>(null)
  const [owner, setOwner] = useState<string | null>(null)
  const [senderList, setSenderList] = useState<string[] | null>(null)
  const [fromDate, setFromDate] = useState<Date | undefined>()

  const submit = async () => {
	  const form = new FormData()
	  if (!text || !owner) return
	  const req = await fetch("/api/analyze", {
		  method: "POST",
		  body: JSON.stringify({text, owner}),
	  })
	  const js = await req.json()

	  window.sessionStorage.setItem("result", JSON.stringify(js))
	  redirect("/wrapped")

  }

  useEffect(() => {
	  const storage = window.sessionStorage.getItem("text")
	  if (!storage) return
	  setText(extractMessage(Buffer.from(storage, "base64").toString(), fromDate));
  	  setSenderList(getSenderList(extractMessage(Buffer.from(storage, "base64").toString(), fromDate)))
  }, [fromDate])

  if (!text || !senderList) return <p>No Text Provided</p>

  return (
	<div className="">
	  <Card>
		<CardHeader className="flex flex-col items-center">
			<h1 className="text-3xl font-semibold">Check The Text!</h1>
		</CardHeader>
		<CardBody className="gap-3">
			<Card className="flex flex-col items-center">
				<CardHeader>
					<h2>Which one are you?</h2>
				</CardHeader>
				<CardBody key={123} className="flex-wrap flex">
					{senderList.map((sender, i) => (
						<Button color={owner === sender ? "success" : "danger"} className="mb-3 mb-3" key={i} onPress={() => setOwner(sender)}>{sender}</Button>
					))}
				</CardBody>
			</Card>

			<Card className="flex flex-col items-center">
				<CardHeader>
					<h2>Check From..?</h2>
				</CardHeader>
				<CardBody>
					<DatePicker minValue={parseDate(text[0].date.toISOString().replace(/T.*/g, ""))} maxValue={parseDate(text[text.length -1].date.toISOString().replace(/T.*/g, ""))} defaultValue={parseDate(text[0].date.toISOString().replace(/T.*/g, ""))} onChange={(e) => setFromDate(e.toDate("UTC"))} />
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h1 className="font-semibold">Ready?</h1>
				</CardHeader>
				<CardBody>
					<Button color="success" onPress={submit}>Submit</Button>
				</CardBody>
			</Card>
		</CardBody>
	  </Card>
	</div>
  );
}
