import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 py-5 px-2 text-white">
      <div className="container mx-auto flex justify-between">
        <div className="flex items-center gap-3">
          <Link className="flex gap-2 items-center" href="/admin">
            {/* <FontAwesomeIcon icon={faChevronLeft} size="sm" /> */}
            <span>Back to courses</span>
          </Link>
          <span className="font-bold">Learn React</span>
          <div className="bg-gray-500 py-1 px-2 text-sm font-bold">Draft</div>
        </div>
        <div>{/* <FontAwesomeIcon icon={faGear} size="lg" /> */}</div>
      </div>
    </nav>
  );
}
