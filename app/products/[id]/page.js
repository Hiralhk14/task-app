import Link from 'next/link';
import { notFound } from 'next/navigation';

import { fetchProductById } from '@/api/products/productsApi';

export default async function ProductDetailsPage({ params }) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  let product;

  try {
    product = await fetchProductById(id);
  } catch (error) {
    console.error('Failed to load product', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const ratingValue = typeof product.rating === 'object' ? product.rating.rate : product.rating;
  const ratingCount = typeof product.rating === 'object' ? product.rating.count : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-5">
            <div>
              <p className="text-sm text-primary-500 font-semibold uppercase tracking-wide">Product Details</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{product.title}</h1>
              <p className="text-gray-600 mt-2 max-w-2xl text-sm md:text-base">{product.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/products"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-500 px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-center"
              >
                Back to Product List
              </Link>
              <Link
                href="/tasks"
                className="bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-center"
              >
                Go to Tasks
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative bg-primary-900/10 flex items-center justify-center">
                <img
                  src={product.image || product.images?.[0] || '/vercel.svg'}
                  alt={product.title}
                  className="w-[60%] md:w-[70%] max-h-72 md:max-h-80 object-contain p-6 md:p-8"
                  loading="eager"
                />
                {product.discountPercentage ? (
                  <span className="absolute top-6 left-6 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Save {product.discountPercentage}%
                  </span>
                ) : null}
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-5">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-2xl md:text-3xl font-bold text-primary-600">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </span>
                  {ratingValue ? (
                    <span className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 mr-1"
                      >
                        <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l1.519 3.649 3.957.342c1.164.1 1.636 1.545.749 2.305l-3 2.59.892 3.846c.263 1.132-.964 2.033-1.96 1.425L12 15.933l-3.368 1.434c-.996.608-2.223-.293-1.96-1.425l.893-3.846-3-2.59c-.888-.76-.415-2.205.749-2.305l3.956-.342 1.518-3.649z" />
                      </svg>
                      {ratingValue}{ratingCount ? ` (${ratingCount})` : ''}
                    </span>
                  ) : null}
                  {product.stock ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      In Stock: {product.stock}
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      Stock status unavailable
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-primary-999 rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-wide text-primary-500 font-semibold">Category</p>
                    <p className="mt-1 text-gray-900 font-semibold capitalize">{product.category || '—'}</p>
                  </div>
                  <div className="bg-primary-999 rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-wide text-primary-500 font-semibold">Brand</p>
                    <p className="mt-1 text-gray-900 font-semibold capitalize">{product.brand || '—'}</p>
                  </div>
                </div>

                {product.tags?.length ? (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-primary-900/10 text-primary-500 text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {product.dimensions ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(product.dimensions).map(([dimension, value]) => (
                      <div key={dimension} className="rounded-2xl bg-primary-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-primary-500 font-semibold">{dimension}</p>
                        <p className="mt-1 text-gray-900 font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {product.warrantyInformation || product.shippingInformation ? (
                  <div className="border border-primary-100 rounded-2xl p-4 bg-primary-999 space-y-2 text-sm">
                    {product.warrantyInformation ? (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Warranty:</span> {product.warrantyInformation}
                      </p>
                    ) : null}
                    {product.shippingInformation ? (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Shipping:</span> {product.shippingInformation}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const product = await fetchProductById(id);
    return {
      title: product?.title ? `${product.title} | Product Details` : 'Product Details',
      description: product?.description || 'Product details'
    };
  } catch {
    return {
      title: 'Product not found',
      description: 'The product you are looking for does not exist.'
    };
  }
}

