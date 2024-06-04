"use client";

export default function Card() {
  return (
    <div className="flex w-full gap-3 items-start lg:items-center relative before:content-[''] before:absolute before:-top-2 before:left-0 before:w-full before:h-[1px] before:bg-slate-300">
      <div className="bg-gray-400 w-32 h-14 lg:w-64 lg:h-28 rounded-md lg:rounded-none lg:rounded-s-md"></div>
      <div className="lg:p-3 flex flex-col justify-between mx-auto w-full">
        <div className="">
          <h5 className="font-semibold text-lg">
            The Web Developer Bootcamp - 2023
          </h5>
          <h6 className="font-semibold mt-2">By John Doe</h6>
        </div>
        <div className="mt-auto flex justify-between">
          <span>9 total hours</span>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center lg:flex-row h-full">
        <div className="lg:mr-20">Remove</div>
        <div className="mt-5 lg:mt-0">
          <h5 className="font-semibold">&#8377;449</h5>
          <h6 className="line-through">&#8377;3199</h6>
        </div>
      </div>
    </div>
  );
}
