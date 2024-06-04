import Thumbnail from "./Thumbnail";
import Link from "next/link";

export default function Video() {
  return (
    <div className="rounded-md">
      <Thumbnail />
      <div className="pt-2 flex justify-between">
        <div>
          <h3 className="font-semibold">React Tutorial</h3>
          <p>Pete Hunt</p>
        </div>
        <Link href="/admin/edit" className="text-sm">
          Edit
        </Link>
      </div>
    </div>
  );
}
