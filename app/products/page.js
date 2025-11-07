'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useAuth } from '@/context/AuthContext';
import { fetchProducts } from '@/api/products/productsApi';
import Pagination from '@/shared/components/common/Pagination';

export default function ProductsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts(1);
    }
  }, [isAuthenticated]);

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      const data = await fetchProducts(limit, page);
      setProducts(data?.products || []);
      setTotalProducts(data?.total || 0);
      setTotalPages(data?.totalPages || 0);
      setCurrentPage(data?.page || page);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadProducts(page);
    }
  };

  const handleBackToTasks = () => {
    router.push('/tasks');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Product List</h1>
                <p className="text-gray-600">List of available products</p>
                <p className="text-sm text-gray-500 mt-1">
                  Total Products: {totalProducts} | Page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleBackToTasks}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-500 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  Back to Tasks
                </button>
                <span className="text-xs text-gray-400">
                  Signed in as {user?.firstName || user?.username || user?.email}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 w-16">ID</span>
                <span className="text-sm font-semibold text-gray-700 flex-1 ml-4">Product</span>
                <span className="text-sm font-semibold text-gray-700 w-24 text-center">Price</span>
                <span className="text-sm font-semibold text-gray-700 w-32 text-right">Category</span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <Link
                        key={product?.id}
                        href={`/products/${product?.id}`}
                        className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md"
                      >
                        <span className="text-sm text-gray-600 font-medium w-16">{product?.id}</span>
                        <div className="flex-1 ml-4">
                          <p className="text-gray-900 font-semibold">{product?.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product?.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary-600 w-24 text-center">
                          ${typeof product?.price === 'number' ? product.price.toFixed(2) : product?.price}
                        </span>
                        <span className="text-sm text-gray-600 w-32 text-right capitalize">{product?.category || '—'}</span>
                      </Link>
                    ))
                  )}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

