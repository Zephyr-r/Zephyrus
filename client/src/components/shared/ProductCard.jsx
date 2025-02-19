import PropTypes from "prop-types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const getConditionText = (condition) => {
  const conditionMap = {
    new: "全新",
    "like-new": "几乎全新",
    good: "良好",
    fair: "一般",
    poor: "较差",
  };
  return conditionMap[condition] || condition;
};

export function ProductCard({ id, name, price, images, seller, condition }) {
  const navigate = useNavigate();

  return (
    <Card
      className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* 卖家信息 */}
      <div className="p-1.5 md:p-3 flex items-center gap-1 md:gap-2">
        <Avatar className="h-5 w-5 md:h-8 md:w-8">
          <AvatarImage
            src={seller?.avatar}
            alt={seller?.username}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                seller?.username || "User"
              )}&background=e5e7eb&color=4b5563&size=128`;
            }}
          />
          <AvatarFallback>
            {seller?.username?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <span className="text-[10px] md:text-sm font-medium truncate">
          {seller?.username}
        </span>
      </div>

      {/* 商品主图 */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={images?.[0] || "https://placehold.co/400x400/e2e8f0/e2e8f0"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x400/e2e8f0/e2e8f0";
          }}
        />
      </div>

      {/* 商品信息 */}
      <div className="p-1.5 md:p-3">
        <h2 className="text-[10px] md:text-sm text-gray-500 line-clamp-2 mb-0.5 md:mb-1">
          {name}
        </h2>
        <div className="flex items-center justify-between mt-0.5 md:mt-2">
          <span className="text-sm md:text-lg font-bold">RM {price}</span>
          <Badge variant="secondary" className="text-[10px] md:text-xs">
            {getConditionText(condition)}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  seller: PropTypes.shape({
    username: PropTypes.string,
    avatar: PropTypes.string,
  }),
  condition: PropTypes.string,
};
