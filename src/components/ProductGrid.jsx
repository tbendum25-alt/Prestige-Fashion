import ProductCard from './ProductCard.jsx';

export function SkeletonCard() {
  return (
    <div className="card card--skeleton" aria-hidden="true">
      <div className="card__media skeleton" />
      <div className="card__body"><div className="skeleton skeleton--line" /><div className="skeleton skeleton--line short" /></div>
    </div>
  );
}

export default function ProductGrid({ products, loading = false, skeletons = 8 }) {
  return (
    <div className="grid">
      {loading
        ? Array.from({ length: skeletons }, (_, i) => <SkeletonCard key={i} />)
        : products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
