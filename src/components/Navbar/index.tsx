"use client";

import { Sling as Hamburger } from "hamburger-react";
import { useState, useEffect, useMemo } from "react";
import MultiLevelDropdown from "../Sidebar";
import Categories from "../Categories";
import { API_URL } from "@/constants/url";
import Link from "next/link";
import SearchBar from "../SearchBar";

// shadcn

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import {
  Category,
  CategoryLookup,
  SelectedSubCategory,
  SubCategoriesMapper,
  SubCategory,
} from "@/types/client.types";

const makeCatSubcatMapper = (
  subCategories: SubCategory[]
): SubCategoriesMapper => {
  const subCategoriesMapper: SubCategoriesMapper = {};

  subCategories.map((item) => {
    if (subCategoriesMapper[item.cat_id]) {
      subCategoriesMapper[item.cat_id].push({
        id: item.id,
        name: item.name,
      });
    } else {
      subCategoriesMapper[item.cat_id] = [{ id: item.id, name: item.name }];
    }
  });

  return subCategoriesMapper;
};

export default function Navbar({ session }: { session: any | null }) {
  const [isOpen, setOpen] = useState(false);
  const [isShownCatgories, setIsShownCategories] = useState(false);
  const pathname = usePathname();
  console.log("pathname", pathname, session);
  const currentUrl = encodeURIComponent(pathname);
  console.log("ENCODED", currentUrl);

  // const [categories, setCategories] = useState<Category[] | null>(null);
  // const [categoryId, setCategoryId] = useState<number | null>(null);
  // const [subCategories, setSubCategories] = useState<SubCategory[] | null>(
  //   null
  // );

  const [categoryId, setCategoryId] = useState<number>(0);
  const [subCategoryId, setSubCategoryId] = useState<number>(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<
    SelectedSubCategory[] | null
  >(null);

  const [categoryLookup, setCategoryLookup] = useState<CategoryLookup>({});

  const [subCategoriesLookup, setSubCategoriesLookup] =
    useState<SubCategoriesMapper>({});

  useEffect(() => {
    const fetchCategoriesAndSubCategories = async () => {
      try {
        const categoriesResponse = await fetch(`${API_URL}/category`);
        const subCategoriesResponse = await fetch(`${API_URL}/sub-category`);
        const { data: categories } = await categoriesResponse.json();
        const { data: subCategories } = await subCategoriesResponse.json();

        setCategories(categories);
        setSubCategoriesLookup(() => makeCatSubcatMapper(subCategories));
        // console.log("hello", makeCatSubcatMapper(subCategories));
      } catch (error) {
        console.error("Error fetching categories and subcategories");
      }
    };

    fetchCategoriesAndSubCategories();
  }, []);

  function handleMouseEnter(e: any) {
    const categoryId = Number(e.target.dataset.id);

    setCategoryId(categoryId);
    setSubCategories(subCategoriesLookup[categoryId]);
  }

  function handleMouseLeave(e: any) {
    setSubCategories(null);
  }

  // useEffect(() => {
  //   console.log({ subCategoriesLookup })
  // })

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const categoriesResponse = await fetch(`${API_URL}/category`);
  //       const { data } = await categoriesResponse.json();
  //       console.log(data);

  //       setCategories(data);
  //     } catch (error) {
  //       console.error("Error fetching categories");
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  // useEffect(() => {
  //   const fetchSubCategories = async () => {
  //     try {
  //       if (categories && categoryId) {
  //         if (!categoryLookup[categoryId]) {
  //           const subCategoriesResponse = await fetch(
  //             `${API_URL}/category/${categoryId}/sub-category`
  //           );
  //           const { data } = await subCategoriesResponse.json();

  //           setCategoryLookup((prevLookup) => {
  //             return { ...prevLookup, [categoryId]: data };
  //           });
  //           setSubCategories(data);
  //         } else {
  //           setSubCategories(categoryLookup[categoryId]);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(`Error fetching sub-categories for ${categoryId}`);
  //     }
  //   };

  //   fetchSubCategories();
  // }, [categories, categoryId, categoryLookup]);

  return (
    <nav className="shadow-md">
      <div
        className={`lg:hidden fixed top-2O w-full overflow-hidden bg-gray-400 z-50 ${
          isOpen ? "h-full min-h-screen" : "h-0"
        }`}
      >
        <MultiLevelDropdown />
      </div>
      <div className="relative">
        <div className="container mx-auto flex justify-between items-center py-2 lg:w-[90%]">
          <div className="lg:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} size={22} />
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/">
              <h1 className="font-semibold">TechVariable</h1>
            </Link>
            <h2
              className="text-sm cursor-pointer relative"
              onMouseEnter={() => setIsShownCategories(true)}
              onMouseLeave={() => setIsShownCategories(false)}
            >
              Categories
              {isShownCatgories && (
                <div className="absolute bg-transparent min-w-[200px] max-w-[500px] min-h-[200px] z-50">
                  <Categories
                    subCategoriesLookup={subCategoriesLookup}
                    categories={categories}
                  />
                </div>
              )}
            </h2>
          </div>
          <SearchBar />
          {session ? (
            <div className="hidden lg:flex items-center gap-5">
              <Link href="/my-courses/learning">
                <h2 className="text-sm">My Learning</h2>
              </Link>
              {/* <Button onClick={() => signOut()}>Logout</Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href="/my-account/profile">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link href="/my-account/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link href="/my-account/faq">
                    <DropdownMenuItem>FAQ</DropdownMenuItem>
                  </Link>
                  <Link href="/my-account/settings">
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOutIcon size={16} className="mr-3" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // <Link href='/auth'> //prev
            <Link href={`/auth?next=${currentUrl}`}>
              <Button>Sign In / Sign Up</Button>
            </Link>
          )}
        </div>
      </div>
      {pathname === "/" && (
        <div className="hidden lg:block w-90% relative z-40">
          <div className="container mx-auto border-t w-[90%]">
            <ul className="flex items-center">
              {categories?.map((category) => {
                return (
                  <Link
                    href={`/search?category=${category.name}`}
                    key={category.id}
                  >
                    <li
                      data-id={category.id}
                      className="cursor-pointer px-4 py-4"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {category.name}

                      {subCategories && (
                        <div className="bg-black text-white absolute w-full left-0 top-14">
                          <ul className="flex items-center container mx-auto w-[90%] gap-5">
                            {categoryId === +category.id &&
                              subCategories &&
                              subCategories.map((item) => (
                                <Link
                                  href={`/search?sub_category=${item.name}`}
                                  key={item.id}
                                >
                                  <li className="py-3 px-4 text-sm hover:text-violet-400 duration-150">
                                    {item.name}
                                  </li>
                                </Link>
                              ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

/*
{subCategories && (
                    <div className="hidden lg:block w-90% bg-black text-white">
                      <div className="container mx-auto py-4 lg:py-2 w-[90%]">
                        <ul className="flex items-center gap-16 py-1">
                          {categoryId === +category.id &&
                            subCategories.map((subcategory) => {
                              return (
                                <li key={subcategory.id}>{subcategory.name}</li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  )}

*/
