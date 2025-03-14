"use client";

import { Button } from "../ui/button";
import useAuthStore from "@/stores/auth.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User as UserIcon } from "lucide-react";

const RightSideNavbar = () => {
  const router = useRouter();
  const { isAuthenticated, userData } = useAuthStore();
  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        // Authenticated User
        <>
          <Button variant={"outline"} className="cursor-pointer hidden md:block" onClick={() => router.push("/write")}>
            Create Post
          </Button>

          {/* Profile Picture */}
          {userData && userData.image ? (
            <Image
              src={userData.image}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full w-6 h-6"
            />
          ) : (
            <UserIcon className="w-6 h-6" />
          )}
        </>
      ) : (
        // Unauthenticated User
        <>
          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Log in
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer hidden md:block"
            onClick={() => router.push("/register")}
          >
            Create Account
          </Button>
        </>
      )}
    </div>
  );
};

export default RightSideNavbar;
