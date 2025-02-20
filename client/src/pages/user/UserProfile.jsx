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
          title: "Failed to fetch user data",
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
        title: "Deleted successfully",
        description: "The product has been successfully deleted.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to delete",
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
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-500">
            {error || "User not found"}
          </div>
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
              Joined on {new Date(userData.createdAt).toLocaleDateString()}
            </p>
            <p className="text-neutral-600">
              {userData.bio || "This user hasn't added a bio yet."}
            </p>
          </div>
        </div>
      </div>

      {/* 在售商品 */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Active Listings</h2>
          {isOwnProfile && (
            <Button onClick={() => navigate("/sell")}>
              List a new product
            </Button>
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
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(product._id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No active listings
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserProfile;
