  "use client";
  /* eslint-disable @next/next/no-img-element */

  import Link from "next/link";
  import { useEffect, useState } from "react";
  import {
    ArrowLeft,
    ArrowRight,
    ImageOff,
    LoaderCircle,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
  } from "lucide-react";
  import api from "../../lib/axios";
  import { getApiErrorMessage } from "../../lib/api-error";
  import { useRequireAuth } from "../../lib/auth";
  import { useToast } from "../../components/toast-provider";
  import { Button } from "../../components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card";

  function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price) || 0);
  }

  function Products() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const { isAuthenticated } = useRequireAuth();
    const toast = useToast();
    const IMAGE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api", "/storage/") || "";

    useEffect(() => {
      if (!isAuthenticated) return;

      const getProducts = async () => {
        setIsLoading(true);
        setError("");
        try {
          const response = await api.get("/products", {
            params: { page, search: search || undefined },
          });
          setProducts(response.data.products.data ?? []);
          console.log("response", response.data);
          setPagination(response.data.products);
        } catch (requestError) {
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load your products. Please try again.",
            ),
          );
        } finally {
          setIsLoading(false);
        }
      };

      getProducts();
    }, [isAuthenticated, page, search, reloadKey]);

    const handleSearch = (event) => {
      event.preventDefault();
      setPage(1);
      setSearch(searchInput.trim());
    };

    const deleteProduct = async (id) => {
      setDeletingId(id);
      try {
        await api.delete(`/products/${id}`);
        const remaining = products.filter((product) => product.id !== id);
        setProducts(remaining);
        toast.success("Product deleted successfully.");
        if (remaining.length === 0 && page > 1) setPage((current) => current - 1);
      } catch (requestError) {
        toast.error(
          getApiErrorMessage(
            requestError,
            "We couldn't delete this product. Please try again.",
          ),
        );
      } finally {
        setDeletingId(null);
      }
    };

    if (!isAuthenticated) {
      return <main className="min-h-screen bg-muted/30" aria-busy="true" />;
    }

    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(0,0,0,.06),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(0,0,0,.04),transparent_22%),linear-gradient(to_bottom,#fff,#f5f5f5)]">
        <div className="pointer-events-none absolute -left-28 top-32 size-80 rounded-full bg-black/5 blur-3xl animate-soft-pulse" />
        <div className="pointer-events-none absolute -right-28 top-8 size-96 rounded-full bg-black/5 blur-3xl animate-soft-pulse" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-reveal flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-black">
                Catalog
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-5xl">
                Products
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage and explore the products in your collection.
              </p>
            </div>
            <Link
              href="/products/create"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-black/80 hover:shadow-xl hover:shadow-black/20 active:translate-y-0"
            >
              <Plus className="size-4" aria-hidden="true" /> Add product
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="animate-reveal mt-7 flex gap-2 rounded-2xl border border-black/10 bg-white/80 p-2 shadow-lg shadow-black/5 backdrop-blur-xl"
            style={{ animationDelay: "80ms" }}
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by name or description..."
                className="h-11 w-full rounded-xl border border-transparent bg-transparent py-2 pl-10 pr-3 text-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>

          {isLoading ? (
            <div className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-xl border border-border bg-card"
                />
              ))}
            </div>
          ) : error ? (
            <Card className="mx-auto mt-10 max-w-lg border-destructive/30 py-0 text-center shadow-none">
              <CardContent className="px-6 py-10">
                <h2 className="text-lg font-semibold">Unable to load products</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {error}
                </p>
                <Button
                  className="mt-5"
                  variant="outline"
                  onClick={() => setReloadKey((current) => current + 1)}
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : products.length === 0 ? (
            <Card className="mx-auto mt-10 max-w-lg border-dashed py-0 text-center shadow-none">
              <CardContent className="px-6 py-12">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                  <Package className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-lg font-semibold">
                  {search ? "No matching products" : "No products yet"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {search
                    ? "Try changing your search terms."
                    : "Start building your catalog by adding your first product."}
                </p>
                {!search && (
                  <Link
                    href="/products/create"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Create a product{" "}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="animate-reveal gap-0 overflow-hidden border-black/10 bg-white/90 py-0 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/12"
                  style={{
                    animationDelay: `${Math.min(products.indexOf(product) * 60, 300)}ms`,
                  }}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
                    {product.banner_image ? (
                      <img
                        src={`${IMAGE_URL}${product.banner_image}`}
                        alt={product.name}
                        className="size-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-zinc-400">
                        <ImageOff className="size-7" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="px-5 pb-2 pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg font-semibold">
                        {product.name}
                      </CardTitle>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2 min-h-10 leading-5">
                      {product.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Product #{product.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/update/${product.id}`}
                          className="inline-flex h-7 items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-colors hover:bg-muted"
                        >
                          <Pencil className="size-3.5" aria-hidden="true" />
                          Update
                        </Link>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === product.id}
                          onClick={() => deleteProduct(product.id)}
                        >
                          {deletingId === product.id ? (
                            <LoaderCircle
                              className="size-3.5 animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          )}
                          {deletingId === product.id ? "Deleting" : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {pagination && pagination.last_page > 1 && !isLoading && !error && (
            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {pagination.from}-{pagination.to} of {pagination.total}{" "}
                products
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ArrowLeft aria-hidden="true" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.last_page}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  export default Products;
