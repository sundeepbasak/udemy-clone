"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/constants/url";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ICategories {
  id: string;
  name: string;
}

const CategoryPage = () => {
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isSubmittingSubCategory, setIsSubmittingSubCategory] = useState(false);
  const [categories, setCategories] = useState<ICategories[] | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");

  const getCategory = async () => {
    const res = await fetch(`${API_URL}/category`);

    const { data } = await res.json();

    setCategories(data);
  };

  const getSubCategory = async () => {
    const res = await fetch(`${API_URL}/sub-category`);

    const { data } = await res.json();

    console.log("GET /sub-category", data);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleCategorySubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmittingCategory(true);

    const formData = new FormData(e.target);

    console.log("category name", formData.get("category"));

    const res = await fetch(`${API_URL}/category`, {
      method: "POST",
      body: JSON.stringify({ name: formData.get("category") }),
    });

    if (res.ok) {
      console.log("submitted");
      setIsSubmittingCategory(false);
      getCategory();
    } else {
      console.error("Error");
      setIsSubmittingCategory(false);
    }

    e.target.reset();
  };

  const getIdByCategory = (categoryName: FormDataEntryValue | null) => {
    console.log("getIdByCategory", categoryName);
    const cat = categoryName?.toString();
    if (categories) {
      for (let item of categories) {
        if (item.name == categoryName) {
          return item.id;
        }
      }
    }
    return "";
  };

  const handleSubCategorySubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmittingSubCategory(true);

    const formData = new FormData(e.target);

    const categoryId = getIdByCategory(formData.get("category"));

    console.log({ categoryId });

    const res = await fetch(`${API_URL}/sub-category`, {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("sub-category"),
        category_id: categoryId,
      }),
    });

    if (res.ok) {
      console.log("submitted subcategory");
      setIsSubmittingSubCategory(false);
      formData.set("sub-category", "");
      getSubCategory();
    } else {
      console.error("Error");
      setIsSubmittingSubCategory(false);
    }
    // e.target.reset();
  };

  // const handleValueChange = (e: any) => {
  //   console.log(e)
  //   // const selectedId = event?.target?.selectedOptions[0].getAttribute('data-id')
  //   // console.log('selected id', selectedId)
  // }

  // // let mapper: Record<string, string> = {}
  // // if (categories) {
  // //   categories.map((item: ICategories) => (mapper[item.name] = item.id))
  // // }

  return (
    <>
      <h3 className="font-semibold text-2xl">Manage Category</h3>
      <div className="mt-6">
        <div className="border border-black p-3 mb-3">
          <h4>Add Category</h4>
          <form
            className="flex gap-3 items-end"
            onSubmit={handleCategorySubmit}
          >
            <label>
              <h5>Title</h5>
              <Input
                type="text"
                className="border-black rounded-none"
                name="category"
              />
            </label>
            {isSubmittingCategory ? (
              <Button disabled className="rounded-none">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                wait
              </Button>
            ) : (
              <Button className="rounded-none" type="submit">
                Add
              </Button>
            )}
          </form>
        </div>
        <div className="border border-black p-3">
          <h4>Add Sub-category</h4>
          <form onSubmit={handleSubCategorySubmit}>
            <div>
              <label>
                <h5>Title</h5>
                <Input
                  type="text"
                  className="border-black rounded-none"
                  name="sub-category"
                />
              </label>
            </div>
            <div>
              <label>
                <h5>Category</h5>
                <Select name="category" disabled={!categories}>
                  <SelectTrigger className="w-full rounded-none border-black">
                    <SelectValue placeholder="select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: any) => (
                      <SelectItem
                        value={category.name}
                        data-id={category.id}
                        key={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            {isSubmittingSubCategory ? (
              <Button disabled className="rounded-none mt-3 w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                wait
              </Button>
            ) : (
              <Button className="rounded-none mt-3 w-full" type="submit">
                Add
              </Button>
            )}{" "}
          </form>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
