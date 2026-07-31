"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import api from "../../../../lib/axios";
import { getApiErrorMessage } from "../../../../lib/api-error";
import { useRequireAuth } from "../../../../lib/auth";
import { useToast } from "../../../../components/toast-provider";
import Link from "next/link";
import { ArrowLeft, ImagePlus, PackagePlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { useParams, useRouter } from "next/navigation";

const inputClassName =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20";

function Update() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    banner_image: null,
  });
  const [currentImage, setCurrentImage] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data.product;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          banner_image: null,
        });
        setCurrentImage(response.data.product.banner_image);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "We couldn't load this product."));
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [id, isAuthenticated, toast]);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      banner_image: e.target.files[0],
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.banner_image) {
        data.append("banner_image", formData.banner_image);
      }

      await api.put(`/products/${id}`, data);
      toast.success("Product updated successfully.");
      router.push("/products");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "We couldn't update this product. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return <main className="min-h-screen bg-muted/30" aria-busy="true" />;
  }

  if (isLoading) return <main className="min-h-screen bg-muted/30 px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto h-96 max-w-2xl animate-pulse rounded-xl border border-border bg-card" /></main>;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,.06),transparent_30%),linear-gradient(to_bottom,#fff,#f5f5f5)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to products
        </Link>

        <Card className="animate-reveal mt-6 border-black/10 bg-card/85 py-0 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <CardHeader className="px-6 pb-3 pt-7 sm:px-8 sm:pt-8">
            <div className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <PackagePlus className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Update a product
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
            <form onSubmit={updateProduct} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product name
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  className="min-h-28 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <input
                    className={`${inputClassName} pl-7`}
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {currentImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`http://127.0.0.1:8000/storage/${currentImage}`}
                  className="w-40 rounded-lg mb-4"
                  alt=""
                />
              )}
              <div className="space-y-2">
                <label htmlFor="banner_image" className="text-sm font-medium">
                  Product image{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <label
                  htmlFor="banner_image"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-4 text-sm transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-background text-muted-foreground shadow-sm">
                    <ImagePlus className="size-4" aria-hidden="true" />
                  </span>
                </label>
                <input
                  className="sr-only"
                  type="file"
                  name="banner_image"
                  id="banner_image"
                  //   accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                />
              </div>

              <Button type="submit" size="lg" className="h-11 w-full" disabled={!isAuthenticated || isSubmitting}>
                {isSubmitting ? "Updating..." : "Update product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Update;
