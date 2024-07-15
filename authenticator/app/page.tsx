"use client";
import { useUserContext } from "@/context/userContext";
import useRedirect from "./hooks/useUserRedirect";
import { useState } from "react";

export default function Home() {
  useRedirect("/login");
  const { logoutUser, user, handlerUserInput, userState, updateUser } = useUserContext();
  const { name, photo, isVerified, bio } = user;

  // openstate
  const [isOpen, setIsOpen] = useState(false);

  // function
  const myToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <main className="py-[2rem] mx-[10rem]">
      <header className="flex justify-between">
        <h1 className="text-[2rem] font-bold">
          Hi <span className="text-blue-400">{name}</span>
        </h1>
        <div className="flex items-center gap-4">
          <img
            src={photo}
            alt={name}
            className="w-[40px] h-[40px] rounded-full"
          />
          {!isVerified && (
            <button className="px-3 py-2 bg-blue-400 text-white rounded-md">
              Email verifizieren
            </button>
          )}
          <button
            onClick={logoutUser}
            className="px-3 py-2 bg-red-500 text-white rounded-md"
          >
            Ausloggen
          </button>
        </div>
      </header>
      <section>
        <p className="text-[#999] text-[2rem]">{bio}</p>

        <h1>
          <button
            onClick={myToggle}
            className="px-3 py-2 bg-blue-400 text-white rounded-md"
          >
            Update Bio
          </button>
        </h1>

        {isOpen && (
          <form className="mt-4 px-8 py-4 max-w-[500px] w-full rounded-md">
            <div className="flex flex-col">
              <label htmlFor="bio" className="mb-1 text-[#42a5f5]">
                Bio
              </label>
              <textarea
                name="bio"
                defaultValue={bio}
                className="px-4 py-3 border-[2px] rounded-md outline-[#42a5f5] text-gray-800"
                onChange={(e) => handlerUserInput("bio")(e)}
              ></textarea>
            </div>
            <button 
            type="submit"
            onClick={(e) => updateUser(e, { bio: userState.bio })}
            className="mt-4 px-3 py-2 bg-blue-400 text-white rounded-md"
            >
              Update
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
