import Image from "next/image";
import { Input } from "../ui/input";

const BlogFormImage = ({
  image,
  handleImageChange,
  deleteImage,
  isLoading,
}: {
  image: string;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteImage: () => void;
  isLoading: boolean;
}) => {
  return (
    <>
      <div className="max-w-2xl mx-auto relative p-1">
        {/* Image Preview */}
        {image && (
          <Image
            src={image}
            alt={`Image Preview`}
            width={300}
            height={170}
            sizes="(max-width: 768px) 75vw, (max-width: 1200px) 33vw, 22vw"
            className="rounded-lg object-cover w-full aspect-video my-4"
          />
        )}
      </div>
      <hr />

      {/* Image Upload or Delete Image */}
      {image ? (
        <div>
          <button
            type="button"
            className="btn btn-error w-full "
            onClick={deleteImage}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Delete Image"
            )}
          </button>
        </div>
      ) : (
        <div>
          <label htmlFor="image" className="text-xl font-semibold block py-4">
            Put Yout Image Cover
          </label>
          {isLoading ? (
            <div className="btn w-full">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleImageChange}
              required
              className="file-input file-input-bordered w-full cursor-pointer"
              disabled={isLoading}
            />
          )}
        </div>
      )}
    </>
  );
};

export default BlogFormImage;
