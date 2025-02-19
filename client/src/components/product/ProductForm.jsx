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
        <Label htmlFor="name">商品标题</Label>
        <Input
          id="name"
          placeholder="请输入商品标题"
          required
          maxLength={100}
          value={formData.name}
          onChange={onChange}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">商品分类</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            onChange({ target: { id: "category", value } })
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">电子产品</SelectItem>
            <SelectItem value="clothing">服装</SelectItem>
            <SelectItem value="books">图书</SelectItem>
            <SelectItem value="furniture">家具</SelectItem>
            <SelectItem value="sports">运动</SelectItem>
            <SelectItem value="others">其他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="condition">商品状态</Label>
        <Select
          value={formData.condition}
          onValueChange={(value) =>
            onChange({ target: { id: "condition", value } })
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择商品状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">全新</SelectItem>
            <SelectItem value="like-new">几乎全新</SelectItem>
            <SelectItem value="good">良好</SelectItem>
            <SelectItem value="fair">一般</SelectItem>
            <SelectItem value="poor">较差</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">价格</Label>
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
        <Label htmlFor="description">商品描述</Label>
        <Textarea
          id="description"
          placeholder="详细描述商品的特点、使用情况等"
          required
          maxLength={1000}
          className="min-h-[150px] resize-none"
          value={formData.description}
          onChange={onChange}
          disabled={disabled}
        />
        <p className="text-sm text-muted-foreground">
          {formData.description.length}/1000 字符
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
