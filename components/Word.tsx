import {Progress} from "@heroui/react";

export default function Word({word, amount}: {word: string, amount: number}) {
  return (
	<div className="flex gap-2">
	  <Progress label={word} showValueLabel aria-label="Word" value={amount} />
	</div>
  );

}
