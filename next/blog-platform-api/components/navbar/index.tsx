import logo from "@/public/logo.svg";
import Image from "next/image";
import SearchBar from "./searchbar";
import Link from "next/link";
import RightSideNavbar from "./right.side.navbar";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between p-2 md:px-10 border-b-2 border-black bg-white">
      <div className="flex items-center gap-5">
        {/* Logo */}
        <Link href="/">
          <Image
            src={logo}
            alt="Story Hive Logo"
            width={200}
            height={200}
            priority
            className="w-20 h-20"
          />
        </Link>

        {/* Search Bar */}
        <SearchBar />
      </div>
      {/* Right Side Navbar */}
      <div>
        <RightSideNavbar />
      </div>
    </nav>
  );
};

export default Navbar;
