"use client";
import { FormEvent, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
// import { Badge } from "flowbite-react";
// import { HiCheck, HiClock } from "react-icons/hi";

interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const TagInput = ({ tags, onTagsChange }: TagInputProps) => {
  const [text, setText] = useState<string>("");

  const removeTag = (id: string) => {
    const nextTags = tags.filter((tag) => {
      return tag.id !== id;
    });

    onTagsChange(nextTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text !== "") {
      e.preventDefault();
      onTagsChange([...tags, { id: crypto.randomUUID(), name: text }]);
      setText("");
    }
  };

  return (
    <div>
      <h3>Add Tags</h3>
      <input
        className="appearance-none block text-gray-700 border py-2 px-3 rounded-md mb-3 leading-tight focus:outline-none"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {tags.length > 0 && (
        <div className="flex gap-2">
          {tags.map((tag) => {
            return (
              <Badge key={tag.id} className="cursor-pointer">
                <X
                  onClick={() => removeTag(tag.id)}
                  size={17}
                  className="mr-2"
                />
                {tag.name}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagInput;
