import MaxVoiceChat from "../components/MaxVoiceChat";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Airspace Tutor
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Duolingo for drone airspace compliance and flight planning.
            </p>
          </div>

          <div className="mt-10 w-full max-w-lg">
            <div className="overflow-hidden rounded-2xl bg-white/[0.05] shadow-xl ring-1 ring-white/[0.1]">
              <div className="p-8">
                <div className="mb-6">
                  <p className="text-lg text-zinc-300 font-semibold mb-2">Welcome to Airspace Tutor!</p>
                  <p className="text-zinc-400 mb-2">Chat with Max about drone airspace compliance and flight planning.</p>
                </div>
                <div className="mt-6">
                  <div className="w-full">
                    <MaxVoiceChat />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
