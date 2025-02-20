import { IoImageOutline, IoCloseCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";

export const ImageUploader = ({
  images,
  onImageAdd,
  onImageRemove,
  maxImages = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
}) => {
  const { toast } = useToast();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // 检查文件大小
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Image size must not exceed ${maxSize / 1024 / 1024}MB`,
      });
      return;
    }

    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    const totalImages = [...images, ...newImages];
    if (totalImages.length > maxImages) {
      toast({
        variant: "destructive",
        title: "Limit exceeded",
        description: `You can upload up to ${maxImages} images`,
      });
      return;
    }

    onImageAdd(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Product Images</Label>
      <div className="grid grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg border-2 border-dashed border-neutral-200"
          >
            <img
              src={image.url}
              alt={`Product Image ${index + 1}`}
              className="h-full w-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => onImageRemove(index)}
            >
              <IoCloseCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-neutral-200 flex items-center justify-center hover:border-neutral-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <IoImageOutline className="h-8 w-8 text-neutral-400" />
          </label>
        )}
      </div>
      <p className="text-sm text-neutral-500">
        Upload up to {maxImages} images, recommended size 800x800px
      </p>
    </div>
  );
};

ImageUploader.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      file: PropTypes.object,
      isExisting: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onImageAdd: PropTypes.func.isRequired,
  onImageRemove: PropTypes.func.isRequired,
  maxImages: PropTypes.number,
  maxSize: PropTypes.number,
};
