"use client";
import { useUserContext } from "@/context/userContext";

export default function Home() {
  const { logoutUser } = useUserContext();
  const name = "WaveLynk";

  return (
    <main className="py-[2rem] mx-[10rem]">
      <header className="flex items-center justify-center">
        <h1 className="text-[2rem] font-bold">
          Hi <span className="text-blue-400">{name}</span>, willkommen auf
          WaveLynk!
        </h1>
        <div className="flex items-center gap-4">
          <img src="" alt="" />

          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-blue-400 text-white rounded-md"
          >
            Ausloggen
          </button>
        </div>
      </header>
    </main>
  );
}
