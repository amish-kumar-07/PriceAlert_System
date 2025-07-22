"use client";
import { useCallback, useState } from "react";
import { DrawerDemo } from "../_components/alert";
import { DropdownMenuDemo } from "../_components/dropdown";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export type Product = {
  [x: string]: any;
  name: string;
  email: string;
  url: string;
  image?: string;
  asin: string;
  currentPrice: number | string;
  original_price?: number | string;
  price_string?: string;
  stars?: number | string;
  total_reviews?: number;
  has_prime?: boolean;
  is_best_seller?: boolean;
  is_amazon_choice?: boolean;
  status?: boolean;
  title?: string;
};

interface ProductCardProps {
  product: Product;
  trackingFrequency: number | string;
  onDeleted: (asin: string, url: string) => void;
  onTracking: (asin: string, status: boolean) => void;
}

export default function ProductCard({
  product,
  trackingFrequency,
  onDeleted,
  onTracking,
}: ProductCardProps) {
  const router = useRouter();
  const [trackingStatus, setTrackingStatus] = useState(product.status ?? false);
  const { userEmail } = useUser();

  const deleteProduct = useCallback(async () => {
    try {
      const response = await fetch("/api/setups/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asin: product.asin,
          url: product.url,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error("Deletion failed:", data.message);
        alert(data.message || "Deletion failed.");
        return;
      }
      onDeleted(product.asin, product.url);
      alert("✅ Product deleted successfully!");
    } catch (err) {
      console.error("Error found:", err);
      alert("Process failed! Nothing was deleted.");
    }
  }, [product.asin, product.url, onDeleted]);

  const toggleTrackingStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/setups/tracking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asin: product.asin,
          email: userEmail,
          status: !trackingStatus,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Status toggle failed:", data.message);
        alert(data.message || "Status toggle failed.");
        return;
      }

      setTrackingStatus(prev => !prev);
      onTracking(product.asin, !trackingStatus);
    } catch (err) {
      console.error("Error toggling tracking:", err);
      alert("Something went wrong while changing tracking.");
    }
  }, [product.asin, trackingStatus, userEmail, onTracking]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-black/30 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${trackingStatus ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
            <span className={`text-sm font-medium ${trackingStatus ? "text-green-400" : "text-gray-400"}`}>
              {trackingStatus ? "Active Tracking" : "Tracking Paused"}
            </span>
          </div>
          <div className="text-xs text-gray-400">ASIN: {product.asin}</div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Image */}
          <div className="w-28 h-28 bg-black/20 rounded-xl overflow-hidden flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name || product.title || "Product"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500">📦</div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-semibold text-white">{product.name || product.title}</h3>
            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline"
              >
                View on Amazon →
              </a>
            )}

            {/* Prices */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-sm text-gray-400">Current Price</p>
                <p className="text-2xl font-bold text-white">₹{product.currentPrice}</p>
              </div>
              {product.original_price && product.original_price !== product.currentPrice && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Original</p>
                  <p className="text-lg text-gray-500 line-through">₹{product.original_price}</p>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.is_best_seller && (
                <span className="px-3 py-1 text-xs font-medium bg-orange-900/30 text-orange-300 rounded-full">Best Seller</span>
              )}
              {product.is_amazon_choice && (
                <span className="px-3 py-1 text-xs font-medium bg-blue-900/30 text-blue-300 rounded-full">Amazon's Choice</span>
              )}
              {product.has_prime && (
                <span className="px-3 py-1 text-xs font-medium bg-purple-900/30 text-purple-300 rounded-full">Prime</span>
              )}
            </div>

            {/* Ratings */}
            {(product.stars || product.total_reviews) && (
              <div className="text-sm text-gray-400 flex items-center gap-3">
                {product.stars && (
                  <span className="flex items-center gap-1">
                    ⭐ <span>{product.stars}</span>
                  </span>
                )}
                {product.total_reviews && <span>({product.total_reviews} reviews)</span>}
              </div>
            )}

            {/* Tracking Frequency */}
            <div className="bg-blue-900/30 p-3 rounded-md text-blue-300 text-sm">
              ⏱ Tracking every {trackingFrequency} hours
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-white/10">
          <div className="flex gap-3">
            <button
              onClick={toggleTrackingStatus}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                trackingStatus
                  ? "bg-green-900/30 text-green-300 hover:bg-green-900/50"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {trackingStatus ? "Pause Tracking" : "Resume Tracking"}
            </button>
            <DrawerDemo />
            <DropdownMenuDemo />
          </div>

          <button
            onClick={deleteProduct}
            className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
