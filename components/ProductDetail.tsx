'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { Star, ChevronLeft, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        
        const data: Product = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      return newQuantity < 1 ? 1 : newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.title} added to your cart`,
      });
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading product...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 rounded-full bg-zinc-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative h-72 w-full">
        <Image 
          src={product.images[0] || product.thumbnail} 
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>
      
      <div className="p-4 flex-1">
        <div className="flex items-center mb-2">
          <h1 className="text-xl font-bold flex-1">{product.title}</h1>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-300 mb-6">{product.description}</p>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-2xl font-bold">${product.price}</div>
        </div>
      </div>
      
      <div className="p-4 mt-auto">
        <button 
          onClick={handleAddToCart}
          className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}