import CreateBlog from "@/components/blog/create.blog";

const WritePage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Share Your Journey, Inspire the World
      </h1>
      <p className="text-center text-gray-600 mb-8 text-lg">
        Let your creativity flow and craft stories that captivate hearts and
        minds
      </p>
      <hr />
      <br />
      <CreateBlog />
    </div>
  );
};

export default WritePage;
