import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductById } from "@/api/products";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState({
    name: "加载中...",
    price: 0,
    description: "",
    images: [],
    seller: {
      username: "",
      avatar: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
        setProduct({
          name: "商品未找到",
          price: 0,
          description: "",
          images: [],
          seller: {
            username: "",
            avatar: "",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaApi]
  );

  const handleContactSeller = () => {
    // 检查用户是否已登录
    if (!user) {
      toast({
        title: "请先登录",
        description: "联系卖家需要登录账号",
      });
      navigate("/login");
      return;
    }

    // 检查是否是自己的商品
    if (user.id === product.seller._id.toString()) {
      toast({
        variant: "destructive",
        title: "无法与自己聊天",
        description: "这是你自己的商品",
      });
      return;
    }

    navigate("/inbox", {
      state: {
        seller: {
          _id: product.seller._id,
          username: product.seller.username,
          avatar: product.seller.avatar,
        },
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
        },
      },
    });
  };

  const handleBuy = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "购买商品需要登录账号",
      });
      navigate("/login");
      return;
    }

    if (user.id === product.seller._id) {
      toast({
        variant: "destructive",
        title: "无法购买自己的商品",
        description: "这是你自己发布的商品",
      });
      return;
    }

    navigate("/payment", {
      state: {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          image: product.images[0],
          seller: product.seller,
          status: product.status,
        },
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[4rem]">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">加载中...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧图片轮播 */}
          <div className="w-full space-y-4">
            <div className="relative group">
              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex-[0_0_100%] min-w-0 relative aspect-square"
                    >
                      <div className="w-full h-full rounded-lg overflow-hidden">
                        {/* 左侧点击区域和提示 */}
                        <div
                          className="absolute left-0 top-0 w-1/2 h-full z-10 group-hover:bg-gradient-to-r from-black/10 to-transparent transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollPrev();
                          }}
                        >
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
                          </div>
                        </div>
                        {/* 右侧点击区域和提示 */}
                        <div
                          className="absolute right-0 top-0 w-1/2 h-full z-10 group-hover:bg-gradient-to-l from-black/10 to-transparent transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollNext();
                          }}
                        >
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
                          </div>
                        </div>
                        <img
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 缩略图导航 */}
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                    selectedIndex === index
                      ? "ring-2 ring-black ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 右侧商品信息 */}
          <div className="space-y-6">
            {/* 卖家信息 */}
            <div
              className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
              onClick={() => navigate(`/user/${product.seller?._id}`)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={product.seller?.avatar}
                  alt={product.seller?.username}
                />
                <AvatarFallback>{product.seller?.username?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{product.seller?.username}</h3>
                <p className="text-sm text-muted-foreground">查看卖家主页</p>
              </div>
            </div>

            {/* 商品信息 */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <h2 className="text-3xl font-bold text-primary">
                RM {product.price}
              </h2>
            </div>

            {/* 商品状态 */}
            <div>
              <h3 className="font-medium mb-2">商品状态</h3>
              <div className="text-muted-foreground">
                {product.condition === "new" && "全新"}
                {product.condition === "like-new" && "几乎全新"}
                {product.condition === "good" && "良好"}
                {product.condition === "fair" && "一般"}
                {product.condition === "poor" && "较差"}
              </div>
            </div>

            {/* 商品描述 */}
            <div>
              <h3 className="font-medium mb-2">商品描述</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 pt-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleContactSeller}
              >
                聊一聊
              </Button>
              <Button className="flex-1" onClick={handleBuy}>
                立即购买
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
