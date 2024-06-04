"use client";
import { API_URL } from "@/constants/url";
import {
  Category,
  SelectedSubCategory,
  SubCategoriesMapper,
  SubCategory,
} from "@/types/client.types";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import TagInput from "./TagInput";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "./ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

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

interface Thumbnail {
  key: string;
  url: string;
}

export default function NewForm({ courseData }: { courseData?: any }) {
  const [subCategoriesLookup, setSubCategoriesLookup] =
    useState<SubCategoriesMapper>({});

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SelectedSubCategory[]>([]);

  const [categoryId, setCategoryId] = useState<number>(-1);
  const [subCategoryId, setSubCategoryId] = useState<number>(-1);

  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  const [courseImage, setCourseImage] = useState<Thumbnail>({
    key: "",
    url: "http://via.placeholder.com/640x360",
  });

  const [isImageLoading, setIsImageLoading] = useState(false);

  const [progress, setProgress] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesAndSubCategories = async () => {
      try {
        const categoriesResponse = await fetch(`${API_URL}/category`);
        const subCategoriesResponse = await fetch(`${API_URL}/sub-category`);
        const { data: categories } = await categoriesResponse.json();
        const { data: subCategories } = await subCategoriesResponse.json();

        setCategories(categories);
        setSubCategoriesLookup(makeCatSubcatMapper(subCategories));
        console.log(makeCatSubcatMapper(subCategories));
      } catch (error) {
        console.error("Error fetching categories and subcategories");
      }
    };

    fetchCategoriesAndSubCategories();
  }, []);

  useEffect(() => {
    setCategoryId(courseData.category_id);
  }, [subCategoriesLookup, courseData]);

  useEffect(() => {
    setSubCategories(subCategoriesLookup[categoryId]);
    setSubCategoryId(courseData.sub_category_id);
  }, [categoryId, courseData, subCategoriesLookup]);

  useEffect(() => {
    setTags(courseData.tags.split(","));
  }, [courseData]);

  // TODO: form validation
  const { values, handleChange, handleSubmit, isSubmitting } = useFormik({
    initialValues: {
      title: courseData ? courseData.title : "",
      description: courseData ? courseData.description : "",
      instructor: courseData ? courseData.instructor : "",
      is_free: courseData ? courseData.is_free : false,
      mrp_price: courseData ? courseData.mrp_price : 0,
      discount: courseData ? courseData.discount : 0,
      requirements: courseData ? courseData.requirements : "",
      contents: courseData ? courseData.contents : "",
    },
    onSubmit: async (values) => {
      const tagNames = tags.map((tag) => tag.name);

      try {
        const formData = {
          ...values,
          category_id: categoryId,
          sub_category_id: subCategoryId,
          tags: tagNames.join(", "),
          thumbnail: courseImage.key,
        };
        console.log(formData);

        const response = await fetch(`${API_URL}/course`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Course created successfully");
          router.push("/admin/dashboard");
        }
      } catch (error) {
        toast.error("Failed to create course! Try again later");
        console.error("Error submitting the form");
      }
    },
  });

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;

    setSubCategories(subCategoriesLookup[categoryId]);
    setCategoryId(+categoryId);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onProgress = (progress: number) => {
    console.log("hitting");
    setProgress(progress);
  };

  const previewImage = async (fileKey: string) => {
    try {
      const res = await fetch(`${API_URL}/files/download?key=${fileKey}`);
      const { key, url } = await res.json();
      setCourseImage({ key, url });
    } catch (error) {
      console.error(error);
    }
  };

  async function uploadImageToS3(
    data: { url: string; key: string },
    file: Blob
  ) {
    try {
      const res = await fetch(data.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          // Add any additional headers you might need (e.g., x-ms-blob-type, x-ms-version)
        },
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      previewImage(data.key);

      return true; // Indicate successful upload
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  const getPresignedUrl = async () => {
    const res = await fetch(`${API_URL}/files/upload?folder=thumbnails`);
    return res.json();
  };

  const handleImageUpload = async (e: any) => {
    try {
      console.log("handle image upload");
      const selectedFile = e.target.files[0];

      const data = await getPresignedUrl();
      console.log("Received pre-signed URL:", data.url);

      const fileData = new Blob([selectedFile], { type: selectedFile.type });
      console.log("Uploading image...");

      const uploadResult = await uploadImageToS3(data, fileData);
      if (uploadResult) {
        console.log("Image uploaded successfully.");
      }
    } catch (error) {
      console.error("Upload process encountered an error:", error);
    }

    // setIsImageLoading(true)
    // const selectedFile = e.target.files[0]
    // const reader = new FileReader()
    // reader.onload = async function (e) {
    //   const data = e.target?.result
    //   console.log({ targetResult: data })
    //   const fileData = new Blob([data!], { type: 'application/octet-stream' })
    //   try {
    //     const res = await fetch(url, {
    //       headers: {
    //         'Content-Type': 'application/octet-stream',
    //         'x-ms-blob-type': 'BlockBlob',
    //         'x-ms-version': '2017-11-09',
    //       },
    //       method: 'PUT',
    //       body: fileData,
    //     })
    //     const text = await res.text()
    //     console.log({ text })
    //   } catch (error) {
    //     console.warn(error)
    //   }
    // }
    // reader.readAsArrayBuffer(selectedFile)

    // let formData = new FormData()
    // formData.append('hello', selectedFile)

    // const response = await fetch(`${url}`, {
    //   method: 'PUT',
    //   body: formData,
    // })
    // const data = await response.json()
    // console.log(data.url)
    // setCourseImage(data.url)

    // const fileUrl = await uploadImage(selectedFile, onProgress);
    // setCourseImage(fileUrl);
  };

  // const uploadImage = async (
  //   file: File,
  //   onProgress: (progress: number) => void
  // ) => {
  //   let formData = new FormData();
  //   formData.append("hello", file);

  //   try {
  //     console.log("hit1");

  //     const res = await axios.post(`${API_URL}/images`, formData, {
  //       onUploadProgress: (progressEvent) => {
  //         const percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / progressEvent.total!
  //         );
  //         onProgress(percentCompleted);
  //       },
  //     });

  //     console.log("hit2", res.data);

  //     return res.data.url;
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };

  useEffect(() => {
    console.log(courseImage);
  }, [courseImage]);

  console.log({ subCategories });

  return (
    <form className="w-full max-w-4xl pt-10 mx-auto" onSubmit={handleSubmit}>
      <h2>categoryId: {categoryId}</h2>
      <h3>sub-categoryId: {subCategoryId}</h3>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            className="block tracking-wide text-gray-700 text-md mb-2"
            htmlFor="title"
          >
            Course Title
          </label>
          <Input
            className="appearance-none block w-full py-3 px-4 mb-3 leading-tight focus:outline-none"
            id="title"
            type="text"
            placeholder="Insert your course title"
            value={values.title}
            onChange={handleChange}
            onKeyDown={handleInputKeyDown}
          />
        </div>

        <div className="w-full px-3">
          <label
            className="block tracking-wide text-gray-700 text-md mb-2"
            htmlFor="description"
          >
            Course Description
          </label>
          <Textarea
            className="resize-none appearance-none block w-full text-gray-700 py-3 px-4 mb-3 leading-tight focus:outline-none"
            id="description"
            placeholder="Insert your course description"
            rows={3}
            value={values.description}
            onChange={handleChange}
          />
          <p className="text-gray-600 text-xs italic mb-2"></p>
        </div>

        <div className="w-full px-3">
          <label
            className="block mb-2 text-sm font-medium text-gray-900"
            htmlFor="small_size"
          >
            Select course Thumbnail
          </label>
          <Input
            name="thumbnail"
            onChange={handleImageUpload}
            className="block w-full mb-5 text-xs text-gray-900 border"
            id="small_size"
            type="file"
          />
          <div className="h-44 w-60 relative flex justify-center items-center">
            <Image
              src={courseImage.url}
              alt={"hello"}
              onLoadingComplete={() => setIsImageLoading(false)}
              fill
              priority
              className="object-cover rounded-sm"
            ></Image>
            {isImageLoading && <Spinner />}
          </div>
          <p className="text-gray-600 text-xs italic mb-2"></p>
        </div>

        <div className="w-full px-3">
          <label
            className="block tracking-wide text-gray-700 text-md mb-2"
            htmlFor="instructor"
          >
            Course Instructor
          </label>
          <Input
            className="appearance-none block w-full py-3 px-4 mb-3 leading-tight focus:outline-none"
            id="instructor"
            type="text"
            placeholder="Insert your course title"
            value={values.instructor}
            onChange={handleChange}
            onKeyDown={handleInputKeyDown}
          />
          <p className="text-gray-600 text-xs italic mb-2"></p>
        </div>

        <div className="w-full px-3 flex gap-6 mb-2">
          <label>
            <h3>Category</h3>
            <select
              name="category"
              value={categoryId}
              onChange={handleCategoryChange}
              className="border py-2 px-3 rounded-md text-gray-700"
            >
              <option value={-1}>Select a category</option>
              {categories?.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            <h3>Sub Category</h3>
            <select
              name="sub-category"
              disabled={!subCategories || subCategories.length === 0}
              // value={courseData?.sub_category_id}
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(+e.target.value)}
              className="border py-2 px-3 rounded-md text-gray-700"
            >
              <option value={-1}>Select a Sub-category</option>
              {subCategories &&
                subCategories.map((subc) => {
                  return (
                    <option key={subc.id} value={subc.id}>
                      {subc.name}
                    </option>
                  );
                })}
            </select>
          </label>
        </div>

        <div className="w-full px-3 mb-2">
          <TagInput tags={tags} onTagsChange={setTags} />
        </div>

        <div className="w-full px-3 flex gap-24 items-center mb-2">
          <label className="flex gap-2 items-center">
            <h3>Is Free?</h3>
            <input
              type="checkbox"
              name="is_free"
              checked={values.is_free}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
            />
          </label>
        </div>

        <div className="px-3">
          <label>
            <h3>Price</h3>
            <Input
              className="appearance-none block w-full mb-3 leading-tight focus:outline-none"
              type="number"
              name="mrp_price"
              onChange={handleChange}
              value={values.mrp_price}
              onKeyDown={handleInputKeyDown}
            />
          </label>
        </div>

        <div className="px-3">
          <label>
            <h3>Discount</h3>
            <Input
              className="appearance-none block w-full mb-3 leading-tight focus:outline-none"
              type="number"
              name="discount"
              onChange={handleChange}
              value={values.discount}
              onKeyDown={handleInputKeyDown}
            />
          </label>
        </div>

        <div className="w-full px-3">
          <label>
            <h3>Requirements</h3>
            <Textarea
              name="requirements"
              onChange={handleChange}
              value={values.requirements}
            ></Textarea>
          </label>
        </div>

        <div className="w-full px-3">
          <label>
            <h3>Contents</h3>
            <Textarea
              name="contents"
              onChange={handleChange}
              value={values.contents}
              placeholder="write course content here"
            ></Textarea>
          </label>
        </div>

        {isSubmitting ? (
          <Button className="ml-3">
            <Loader2 className="animate-spin" />
            <span className="pl-3">Loading...</span>
          </Button>
        ) : (
          <Button type="submit" color="dark" className="ml-3 mt-5">
            Create
          </Button>
        )}
      </div>
    </form>
  );
}
