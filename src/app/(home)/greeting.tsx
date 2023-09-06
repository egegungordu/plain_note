export default async function Greeting({
  loggedIn,
  userName,
}: {
  loggedIn: boolean;
  userName: string;
}) {
  if (loggedIn) {
    return (
      <h1 className="text-4xl font-bold text-neutral-300">
        Good day, <span className="text-orange-700">{userName}</span>
        <HandWave />
      </h1>
    );
  }

  return (
    <h1 className="text-4xl font-bold text-neutral-300">
      Welcome to <span className="text-orange-700">Plain Note</span>
      <HandWave />
    </h1>
  );
}

function HandWave() {
  return (
    <span className="text-6xl inline-block origin-bottom-right animate-wave ml-2">
      👋
    </span>
  );
}
