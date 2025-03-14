import { cookies } from "next/headers";

export default async function Home() {
  const cookiesStored = cookies();
  const token = (await cookiesStored).getAll();
console.log(token);
  return <div></div>;
}
