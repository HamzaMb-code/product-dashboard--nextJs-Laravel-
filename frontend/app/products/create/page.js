"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ImagePlus, PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { getApiErrorMessage } from "../../../lib/api-error";
import { useRequireAuth } from "../../../lib/auth";
import { useToast } from "../../../components/toast-provider";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const inputClassName =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20";

function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    banner_image: null,
  });
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <main className="min-h-screen bg-muted/30" aria-busy="true" />;
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const createProduct = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);

      if (formData.banner_image) {
        data.append("banner_image", formData.banner_image);
      }

     await api.post("/products", data);
      toast.success("Product created successfully.");
      router.push("/products");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "We couldn't create this product. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Add a product
            </CardTitle>
            <CardDescription className="mt-2 leading-6">
              Add the details customers need to discover your product.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
            <form onSubmit={createProduct} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product name
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="e.g. Wireless headphones"
                  value={formData.name}
                  onChange={handleChange}
                  required
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
                  placeholder="Describe the product, its features, and what makes it useful."
                  value={formData.description}
                  onChange={handleChange}
                  required
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
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="banner_image" className="text-sm font-medium">
                  Product image <span className="text-muted-foreground">(optional)</span>
                </label>
                <label
                  htmlFor="banner_image"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-4 text-sm transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-background text-muted-foreground shadow-sm">
                    <ImagePlus className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">
                      {formData.banner_image ? formData.banner_image.name : "Upload an image"}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      PNG, JPG, or WEBP
                    </span>
                  </span>
                </label>
                <input
                  className="sr-only"
                  type="file"
                  name="banner_image"
                  id="banner_image"
                //   accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      banner_image: event.target.files[0] 
                    });
                  }}
                />
              </div>

              <Button type="submit" size="lg" className="h-11 w-full" disabled={!isAuthenticated || isSubmitting}>
                {isSubmitting ? "Creating..." : "Create product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default CreateProduct;
