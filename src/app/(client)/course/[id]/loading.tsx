// by default client component
"use client";

import Spinner from "@/components/Spinner";

const Loading = () => {
  return (
    <div className="h-screen items-center justify-center">
      <Spinner />
    </div>
  );
};

export default Loading;
