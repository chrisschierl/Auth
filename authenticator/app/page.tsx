"use client";
import { useUserContext } from "@/context/userContext";

export default function Home() {
  const user = useUserContext();
  return <main></main>;
}
