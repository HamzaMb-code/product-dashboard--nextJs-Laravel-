<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return response()->json([
            "status" => true,
            "products" => $products
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $data = $request->validate([
            "name" => "required|string|max:255",
            "description" => "nullable|string",
            "price" => "required|numeric",
            "banner_image" => "nullable|image|mimes:jpg,jpeg,png|max:2048"
        ]);

        if ($request->hasFile("banner_image")) {
            $image = $request->file("banner_image")->store("products", "public");
            $data["banner_image"] = $image;
        };

        $data["user_id"] = $request->user()->id;

        $product = Product::create($data);

        return response()->json([
            "status" => true,
            "message" => "Product created successfully",
            "product" => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json([
            "status" => true,
            "product" => $product
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // this is for check the owner of the product 
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                "status" => false,
                "message" => "Unauthorized"
            ], 403);
        }

        $data = $request->validate([
            "name" => "required|string|max:255",
            "description" => "nullable|string",
            "price" => "required|numeric",
            "banner_image" => "nullable|image|mimes:jpg,jpeg,png|max:2048",
        ]);

        if ($request->hasFile("banner_image")) {

            if ($product->banner_image) {
                Storage::disk("public")->delete($product->banner_image);
            }

            $data["banner_image"] = $request->file("banner_image")
                ->store("products", "public");
        }

        $product->update($data);

        return response()->json([
            "status" => true,
            "message" => "Product updated successfully",
            "product" => $product
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product)
    {
        // this is also for check the owner of the product
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                "status" => false,
                "message" => "Unauthorized"
            ], 403);
        }

        // here we gonna we gonna delete also the image if already exist (that's why did 'if')
        if ($product->banner_image) {
            Storage::disk("public")->delete($product->banner_image);
        }

        $product->delete();

        return response()->json([
            'status' => true,
            "message" => "Product deleted successfully"
        ], 200);
    }
}
