import Image from "next/image";
import thumbnail from "../../public/images/documentary.webp";

export default function Thumbnail() {
  return (
    <Image
      src={thumbnail}
      alt="thumbnail"
      width={200}
      height={200}
      className="rounded-md"
      priority
    ></Image>
  );
}
