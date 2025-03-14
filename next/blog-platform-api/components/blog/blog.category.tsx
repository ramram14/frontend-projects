const blogCategoriesEnum = [
  "Lifestyle",
  "Hoby",
  "Technology",
  "Fashion",
  "Gaming",
  "Health",
  "Business",
  "Education",
  "Philosophy",
  "Other",
];

const BlogFormCategory = ({
  category,
  setCategory,
}: {
  category: string;
  setCategory: (category: string) => void;
}) => {
  return (
    <>
      <label className="text-xl font-semibold block mt-4">Category</label>
      <select 
        onChange={(e) => setCategory(e.target.value)}
        defaultValue={category}
        name="category"
        id="category"
        title="category"
        className="w-full border-2  p-2 rounded-md btn"
      >
        {blogCategoriesEnum.map((category, i) => (
          <option key={i} value={category}>
            {category}
          </option>
        ))}
      </select>
    </>
  );
};

export default BlogFormCategory;
