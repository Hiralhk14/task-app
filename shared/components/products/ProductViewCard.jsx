export default function ProductViewCard({ product, onSelect }) {
  if (!product) return null;

  const {
    title,
    description,
    price,
    rating,
    thumbnail,
    category,
    brand,
    discountPercentage
  } = product;

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image available
          </div>
        )}
        {typeof discountPercentage === 'number' && discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            -{discountPercentage}%
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{title}</h3>
            {(brand || category) && (
              <p className="mt-1 text-sm text-gray-500 truncate">
                {[brand, category].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
          <span className="text-xl font-bold text-primary-600 whitespace-nowrap">
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </span>
        </div>

        {description && (
          <p className="text-sm text-gray-600 line-clamp-3 flex-1">{description}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-yellow-500 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l1.519 3.649 3.957.342c1.164.1 1.636 1.545.749 2.305l-3 2.59.892 3.846c.263 1.132-.964 2.033-1.96 1.425L12 15.933l-3.368 1.434c-.996.608-2.223-.293-1.96-1.425l.893-3.846-3-2.59c-.888-.76-.415-2.205.749-2.305l3.956-.342 1.518-3.649z" />
            </svg>
            {rating ?? 'N/A'}
          </div>

          <button
            type="button"
            onClick={() => onSelect?.(product)}
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

