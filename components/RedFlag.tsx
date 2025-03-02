export default function RedFlag({emoji, text}: {emoji: string, text: string}) {
  return (
	<div className="flex gap-2">
	  <span className="text-xl">{emoji}</span>
	  <p>{text}</p>
	</div>
  );
}
