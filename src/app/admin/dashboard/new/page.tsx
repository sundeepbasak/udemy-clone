"use client";

import Link from "next/link";
import NewForm from "@/components/NewForm";

const AddPage = () => {
  return (
    <main className="pt-5">
      <div className="container mx-auto">
        <Link href="/admin/dashboard">
          <h2>Go back</h2>
        </Link>
        <NewForm />
      </div>
    </main>
  );
};

export default AddPage;
