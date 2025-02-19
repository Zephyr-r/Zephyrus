import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getUserById, getUserProducts } from "@/api/users";
import { deleteProduct } from "@/api/products";
import { useAuth } from "@/hooks/useAuth";

const UserProfile = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const isOwnProfile = user && user.id === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [user, listings] = await Promise.all([
          getUserById(userId),
          getUserProducts(userId),
        ]);

        setUserData({
          ...user.data,
          listings: listings.data,
        });
      } catch (err) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "获取用户信息失败",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, toast]);

  const handleEdit = (productId) => {
    navigate(`/product/${productId}/edit`);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete);
      setUserData((prev) => ({
        ...prev,
        listings: prev.listings.filter((p) => p._id !== productToDelete),
      }));
      toast({
        title: "删除成功",
        description: "商品已成功删除",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: err.message,
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const openDeleteDialog = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-500">{error || "用户不存在"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* 用户基本信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userData.avatar} alt={userData.username} />
            <AvatarFallback>{userData.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{userData.username}</h1>
            <p className="text-muted-foreground mb-4">
              加入时间：{new Date(userData.createdAt).toLocaleDateString()}
            </p>
            <p className="text-neutral-600">
              {userData.bio || "这个用户很懒，还没有填写简介"}
            </p>
          </div>
        </div>
      </div>

      {/* 在售商品 */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">在售商品</h2>
          {isOwnProfile && (
            <Button onClick={() => navigate("/sell")}>发布新商品</Button>
          )}
        </div>
        {userData.listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userData.listings.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  images={product.images}
                  seller={{
                    username: userData.username,
                    avatar: userData.avatar,
                  }}
                />
                {isOwnProfile && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(product._id)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(product._id)}
                    >
                      删除
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            暂无在售商品
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个商品吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserProfile;
