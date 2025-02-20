import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from "prop-types";

export const ProductForm = ({ formData, onChange, disabled }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Title</Label>
        <Input
          id="name"
          placeholder="Enter product title"
          required
          maxLength={100}
          value={formData.name}
          onChange={onChange}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            onChange({ target: { id: "category", value } })
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="condition">Condition</Label>
        <Select
          value={formData.condition}
          onValueChange={(value) =>
            onChange({ target: { id: "condition", value } })
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Brand New</SelectItem>
            <SelectItem value="like-new">Like New</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">Price</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            RM
          </span>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            required
            min="0"
            step="0.01"
            className="pl-12"
            value={formData.price}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide details about the product, its condition, usage, etc."
          required
          maxLength={1000}
          className="min-h-[150px] resize-none"
          value={formData.description}
          onChange={onChange}
          disabled={disabled}
        />
        <p className="text-sm text-muted-foreground">
          {formData.description.length}/1000 characters
        </p>
      </div>
    </div>
  );
};

ProductForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
