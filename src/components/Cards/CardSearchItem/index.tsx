import { Course } from "@/types/client.types";
import Image from "next/image";
import Link from "next/link";

const CardSearchItem = ({ item }: { item: Course }) => {
  console.log({ mrp: item.mrp_price, discount: item.discount });
  const discountPrice = Math.floor(
    item.mrp_price - item.mrp_price * (item.discount / 100)
  );

  return (
    <Link href={`/course/${item.course_slug}`}>
      <div className="flex w-full gap-3 items-stretch my-5">
        <div className="bg-gray-400 w-32 h-14 lg:w-64 lg:h-28 rounded-md relative">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            priority
            className="object-cover rounded-sm"
          />
        </div>
        <div className="px-3 flex flex-col justify-between mx-auto w-full">
          <div className="">
            <h5 className="font-semibold text-lg">{item.title}</h5>
            <p className="text-sm text-gray-700">
              {item.description.split(".")[0]}
            </p>
          </div>
          <div className="mt-auto flex justify-between text-gray-700 font-semibold text-sm">
            <span>{item.instructor}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between items-center lg:flex-row h-full">
          <div className="mt-5 lg:mt-0">
            <h5 className="font-semibold">&#8377;{discountPrice}</h5>
            <h6 className="line-through">
              &#8377;{Math.floor(item.mrp_price)}
            </h6>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardSearchItem;
