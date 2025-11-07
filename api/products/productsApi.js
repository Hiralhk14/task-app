import axios from 'axios';

const productApi = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000
});

export async function fetchProducts(limit = 10, page = 1) {
  const { data } = await productApi.get('/products');

  if (!Array.isArray(data)) {
    throw new Error('Unexpected products response');
  }

  const total = data.length;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    products: data.slice(startIndex, endIndex),
    total,
    page,
    totalPages
  };
}

export async function fetchProductById(id) {
  if (!id && id !== 0) {
    throw new Error('Product id is required');
  }

  const { data } = await productApi.get(`/products/${id}`);
  return data;
}