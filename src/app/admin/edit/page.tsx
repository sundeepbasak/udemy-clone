"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "./components/Navbar";
import SectionList from "./components/SectionList";

export default function EditPage() {
  const [inputs, setInputs] = useState<string[]>([]);

  const handleAddField = (): void => {
    const newInputs = [...inputs];
    newInputs.push("");
    setInputs(newInputs);
  };

  const handleInputChange = (index: number, value: string): void => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleDelete = (index: number): void => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handleSubmit = (): void => {
    console.log("submitting...");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-5">
        <div className="container mx-auto">
          <header className="flex justify-between items-center pt-10">
            <h1 className="text-4xl">Course Curriculum</h1>
            <button
              className="border-2 border-gray-500 px-4 py-3 font-medium"
              onClick={handleAddField}
            >
              + Add Section
            </button>
          </header>
          <SectionList />
          {/* <section className="py-8 relative"> */}
          <div className="flex flex-col gap-5 min-h-[50vh]">
            {inputs.map((value, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between lg:w-3/4 md:w-full gap-2"
                >
                  Section {index + 1}
                  <input
                    className="flex-1"
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                  <button onClick={(e) => handleDelete(index)}>Delete</button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button
              className="border-2 px-3 py-4 bg-gray-800 text-white my-2"
              onClick={handleSubmit}
            >
              Submit Sections
            </button>
          </div>
          {/* </section> */}
        </div>
      </main>
    </>
  );
}
