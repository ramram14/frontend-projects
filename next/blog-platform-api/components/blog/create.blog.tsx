"use client";

import dynamic from "next/dynamic";
import BlogFormTitleSubtitle from "./blog.title";
import BlogFormImage from "./blog.image";
import BlogFormCategory from "./blog.category";
import { useRouter } from "next/navigation";
import useCreateBlogStore from "@/stores/create.blog.store";

const Tiptap = dynamic(() => import("@/components/text-editor/tiptap"), {
  ssr: false,
});

const CreateBlog = () => {
  const router = useRouter();

  const {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    image,
    content,
    category,
    setCategory,
    isLoadingCreateBlog,
    errorMessage,
    handleContentChange,
    handleImageChange,
    handleDeleteImage,
    uploadBlog,
    resetCreateBlogStore,
  } = useCreateBlogStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const data = await uploadBlog(e);
    // if (data.success) {
    //     resetCreateBlogStore();
    //     router.push(`/blog/${data.data.slug}`);
    // }

    console.log(title, subtitle, image, content, category);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BlogFormTitleSubtitle
        title={title}
        setTitle={setTitle}
        subtitle={subtitle}
        setSubtitle={setSubtitle}
      />
      <hr />
      <BlogFormImage
        image={image}
        handleImageChange={handleImageChange}
        deleteImage={handleDeleteImage}
        isLoading={isLoadingCreateBlog}
      />
      <hr />
      <BlogFormCategory
        category={category}
        setCategory={setCategory}
      />

      <hr />

      {/* Text editor */}
      <label className="text-xl font-semibold block mt-4">Content</label>
      <Tiptap onChange={handleContentChange} value={content} />

      {/* Error Message */}
      {errorMessage && (
        <div role="alert" className="alert alert-error py-4 my-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">Error: {errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" className="w-full btn btn-success mt-4">
        {isLoadingCreateBlog ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : (
          "Create Blog"
        )}
      </button>
    </form>
  );
};

export default CreateBlog;
