import Greeting from './greeting'

export default function Home() {

  return (
    <main className="relative p-8 flex min-h-screen items-stretch justify-between text-neutral-300">
      <Greeting />
    </main>
  )
}
