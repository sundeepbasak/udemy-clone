import MainFooter from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { authOptions } from "@/utils/authOptions.utils";
import { getServerSession } from "next-auth";

export default async function ClientPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  console.log("SESSION", session);

  return (
    <>
      <Navbar session={session} />
      {children}
      <MainFooter />
    </>
  );
}
