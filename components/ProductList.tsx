'use client';

import { useEffect, useState } from 'react';
import { Product, ProductsResponse, Category } from '@/lib/types';
import { Star, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const data: ProductsResponse = await res.json();
        setProducts(data.products);
        
        // Extract unique categories and create category objects
        const uniqueCategories = Array.from(new Set(data.products.map(p => p.category)));
        setCategories(
          uniqueCategories.map((cat, index) => ({
            name: cat,
            isActive: index === 0 // Make the first category active by default
          }))
        );
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (clickedCategory: string) => {
    setCategories(categories.map(cat => ({
      ...cat,
      isActive: cat.name === clickedCategory
    })));
  };

  const activeCategory = categories.find(cat => cat.isActive)?.name || '';
  const filteredProducts = activeCategory 
    ? products.filter(product => product.category === activeCategory)
    : products;

  if (loading) return <div className="flex justify-center p-8">Loading products...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      
      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              category.isActive 
                ? 'bg-yellow-400 text-black font-bold' 
                : 'bg-zinc-800 text-white'
            }`}
          >
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-zinc-900 rounded-lg overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <div className="relative h-36 w-full">
                <Image 
                  src={product.thumbnail} 
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-sm">{product.rating.toFixed(1)}</span>
                </div>
                <h3 className="font-bold text-sm mb-1 truncate">{product.title}</h3>
                <p className="text-xs text-gray-400 mb-2 truncate">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${product.price}</span>
                  <button 
                    className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toast({
                        title: "Added to cart",
                        description: `${product.title} added to your cart`,
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}