import ProductDetail from '@/components/ProductDetail';

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // Fetch all products to generate static pages for each product
  const res = await fetch('https://dummyjson.com/products');
  const data = await res.json();
  
  // Return an array of objects with the id parameter for each product
  return data.products.map((product: { id: number }) => ({
    id: product.id.toString(),
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <ProductDetail id={params.id} />
    </div>
  );
}