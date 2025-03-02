"use client";

import {Button} from "@heroui/button";
import {Card, CardBody, CardHeader, CircularProgress} from "@heroui/react";
import {BlobReader, TextWriter, ZipReader} from "@zip.js/zip.js";
import {redirect} from "next/navigation";
import React from "react";
import {FileUploader} from "react-drag-drop-files";

export default function Home() {
	const [file, setFile] = React.useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleDrop = (file:File) => {
		console.log(typeof file)
		setFile(file);
	}

	const submit = async () => {
		if (!file) return;
		console.log(file)
		setIsSubmitting(true);

		if (file.type === "application/zip") {
			const zipFileReader = new BlobReader(file);
			const zipReader = new ZipReader(zipFileReader);
			const textWriter = new TextWriter();
			
			const files = await zipReader.getEntries();
			const textFiles = files.filter((file) => file.filename.endsWith(".txt"))
			

			if (!textFiles || !textFiles[0]) {
				alert("No text files found in the zip file");
				setIsSubmitting(false);
				return;
			}

			const textFile = await textFiles[0].getData!(textWriter);
			zipReader.close();
			console.log(textFile);

			const b64 = Buffer.from(textFile).toString("base64");

			window.sessionStorage.setItem("text", b64);
			redirect("read-text")
		}
		else if (file.type === "text/plain") {
			window.sessionStorage.setItem("text", Buffer.from(await file.text()).toString("base64"));
			redirect("read-text")
		}
	}

	return (
		<main>
			<Card>
				<CardHeader className="justify justify-center flex flex-col">
					<h1 className="text-3xl font-semibold">Chat Wrapped</h1>
					<h2 className="text-xl font-semibold">View summary of your WhatsApp messages with your friend!</h2>
				</CardHeader>
				<CardBody>	
				{isSubmitting ? (
					<div className="flex justify-center">
						<CircularProgress label="Submitting... Please wait a moment" />
					</div>
					) :
					(
					<div className="flex flex-col items-center">
						<FileUploader className="w-full" children={(
							<Button color="success" className="m-3" variant="bordered">Drop your file here!</Button>
						)} handleChange={handleDrop} name="file" types={["ZIP", "TXT"]} />
						{file && (
							<Button className="w-full" color="success" onPress={submit}>Submit</Button>
						)}
						<p className="text-sm font-thin">Note : Your file will be processed using AI to determine some parameters. Your file will not be saved on our server.</p>
						{file && file.type === "application/zip" && (
							<p className="text-sm font-thin">Note : The content in this ZIP file will not be processed in our server, The extraction of the text Message will happen in client-side (Your device). We will only get the text data</p>
						)}
					</div>
					)}


				</CardBody>
			</Card>
		</main>
	);
}
