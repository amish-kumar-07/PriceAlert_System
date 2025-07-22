"use client";
import { useState } from 'react';
import { NavbarDemo } from './_components/navbar';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { useUser } from "@/app/context/UserContext"; // ✅ correct
import { Progress } from "@/components/ui/progress";


type Product = {
  name: string;
  url: string;
  image?: string;
  asin: string;
  price: number | string;
  original_price?: number | string;
  price_string?: string;
  stars?: number | string;
  total_reviews?: number;
  has_prime?: boolean;
  is_best_seller?: boolean;
  is_amazon_choice?: boolean;
};

type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating_high' | 'rating_low' | 'reviews_high';

const loadingStates = [
  { text: "Travelling in a flight" },
  { text: "Meeting Tyler Durden" },
  { text: "He makes soap" },
  { text: "We go to a bar" },
  { text: "Start a fight" },
  { text: "We like it" },
  { text: "Welcome to F**** C***" },
];

export default function Page() {
  const [item, setItem] = useState('');
  const [products, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId , userEmail } = useUser();
  const [progress, setProgress] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Alert will be sent on respective email registered?",
    "Where is Andrew Laeddis hiding?",
    "Write a JavaScript method to reverse a string",
    "How to assemble your own PC?",
  ];

  // Helper function to extract numeric price from price string or number
  const extractPrice = (product: Product): number => {
    if (typeof product.price === 'number') {
      return product.price;
    }
    
    if (typeof product.price === 'string') {
      const match = product.price.match(/[\d,]+\.?\d*/);
      return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    }
    
    if (product.price_string) {
      const match = product.price_string.match(/[\d,]+\.?\d*/);
      return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    }
    
    return 0;
  };

  // Helper function to extract numeric rating
  const extractRating = (product: Product): number => {
    if (typeof product.stars === 'number') {
      return product.stars;
    }
    
    if (typeof product.stars === 'string') {
      const match = product.stars.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 0;
    }
    
    return 0;
  };

  // Sort products based on selected option
  const sortProducts = (productsToSort: Product[], sortOption: SortOption): Product[] => {
    const sortedProducts = [...productsToSort];
    
    switch (sortOption) {
      case 'relevance':
        return originalProducts.length > 0 ? [...originalProducts] : sortedProducts;
      
      case 'price_low':
        return sortedProducts.sort((a, b) => extractPrice(a) - extractPrice(b));
      
      case 'price_high':
        return sortedProducts.sort((a, b) => extractPrice(b) - extractPrice(a));
      
      case 'rating_high':
        return sortedProducts.sort((a, b) => extractRating(b) - extractRating(a));
      
      case 'rating_low':
        return sortedProducts.sort((a, b) => extractRating(a) - extractRating(b));
      
      case 'reviews_high':
        return sortedProducts.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
      
      default:
        return sortedProducts;
    }
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value as SortOption;
    setSortBy(newSortOption);
    
    if (products.length > 0) {
      const sortedProducts = sortProducts(products, newSortOption);
      setProduct(sortedProducts);
    }
  };

  const addNotification = async (product: Product) => {
    try {
      const notificationPayload = {
        email: userEmail,
        asin: product.asin,
        currentPrice: product.price ?? 0,
        frequency: 3,
        status: true,
        userId,
      };

      console.log("📤 Sending notification payload:", notificationPayload);

      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationPayload),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      if (!contentType?.includes("application/json")) {
        const html = await response.text();
        throw new Error(`Expected JSON, got HTML: ${html.substring(0, 100)}...`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("❌ Error setting up notification:", error.message);
      throw error;
    }
  };



  // Updated handleclick function
  const handleclick = async (product: Product) => {
    if (!userId || !userEmail) {
      alert("⚠️ User not found. Please log in.");
      return;
    }
    if(!product.asin)
    {
      alert("This Product don't have any unique ID!.So Can't Be added into the database");
      return ;
    }
    // Debug: Log the raw product details
    console.log("Product received:", product);
    console.log("Original price:", product.original_price);
    console.log("Price string:", product.price_string);

    // Prepare the payload with fallbacks
    const payload = {
      userId: userId,
      email: userEmail,
      name: product.name,
      url: product.url,
      image: product.image ?? "",
      asin: product.asin,
      platform: "amazon",
      platformProductId: product.asin,
      currentPrice: product.price ?? 0,
      originalPrice: product.original_price ?? null,
      priceString: product.price_string ?? null,
      stars: product.stars ?? null,
      totalReviews: product.total_reviews ?? null,
      hasPrime: product.has_prime ?? false,
      isBestSeller: product.is_best_seller ?? false,
      isAmazonChoice: product.is_amazon_choice ?? false,
      isFkAssured: false,
    };
    setProgress(10);
    // Debug: Show final payload
    console.log("Final payload being sent to /api/product:", payload);

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
     
      if (!response.ok) {
        console.error("❌ Failed to add product:", data.message);
        alert(`❌ Error: ${data.message}`);
        setProgress(null);
        return;
      }
      setProgress(50);
      if (data.message.includes("already in your tracking list")) {
        //alert("📝 This product is already in your tracking list!");
      } else {
        //alert("🔔 Product added to your tracking list successfully!");
      }
      const notifyRes = await addNotification(product);
      //alert("🔔 Notification set up successfully!");
      console.log("Notification : ",notifyRes);
      setProgress(100);

      setTimeout(() => setProgress(null), 600);
    } catch (error) {
      console.error("🔥 Unexpected error:", error);
      setProgress(null);
      //alert("⚠️ Something went wrong. Please try again.");
      return;
    }
  };



  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Show loader
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item }),
      });
      const data = await response.json();
      if (response.ok) {
        setOriginalProducts(data.products); // Store original order
        setProduct(data.products);
        setSortBy('relevance'); // Reset to relevance when new search is performed
        console.log("Product API response:", data.products);
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setTimeout(() => setLoading(false), 2000); // Wait for loader duration to end
    }
  };

 return (
  <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black relative">
    {/* Loader */}
    {loading && (
      <>
        <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120] hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors duration-200"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-8 w-8" />
        </button>
      </>
    )}

    {/* ⇢ Center‑screen progress bar (show while progress !== null) */}
    {progress !== null && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <Progress value={progress} className="w-80 h-3" />
          <p className="text-center mt-4 text-gray-600 dark:text-gray-300 text-sm">
            Processing your request...
          </p>
        </div>
      </div>
    )}

    {/* Navigation */}
    <div className="w-full flex justify-evenly items-center px-4 sm:px-6 lg:px-8 py-4 shadow-sm bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <NavbarDemo />
    </div>

    {/* Search Section */}
    <div className="w-full flex flex-col items-center px-4 mt-16 mb-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
          Search Your Product Here
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover amazing products with detailed reviews and competitive pricing
        </p>
      </div>
      
      <div className="w-full max-w-2xl">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={(e) => setItem(e.target.value)}
          onSubmit={onSubmit}
        />
      </div>
    </div>

    {/* Product Results */}
       <div className="w-full px-4 pb-16">
    {products.length > 0 && (
      <>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Search Results ({products.length} products)
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Sort by:</span>
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating_high">Rating: High to Low</option>
                <option value="rating_low">Rating: Low to High</option>
                <option value="reviews_high">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full px-4 pb-10">
          {products.map((product, index) => (
            <CardContainer key={index} className="inter-var h-full">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border flex flex-col">
                <CardItem
                  translateZ="50"
                  className="text-lg font-semibold text-neutral-600 dark:text-white h-14 overflow-hidden text-ellipsis line-clamp-2 flex items-center"
                >
                  {product.name}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 h-6 flex items-center"
                >
                  ⭐ {product.stars} ({product.total_reviews} reviews)
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4 flex-1 flex items-center">
                  <img
                    src={product.image}
                    height="1000"
                    width="1000"
                    className="h-60 w-full object-contain rounded-xl group-hover/card:shadow-xl"
                    alt={product.name}
                  />
                </CardItem>
                <div className="flex items-center mt-6 justify-between">
                  {/* Left side: Price and View link */}
                  <div className="flex flex-col">
                    <CardItem
                      translateZ={20}
                      as="div"
                      className="px-4 py-2 ml-5 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold mb-1"
                    >
                      {product.price_string}
                    </CardItem>
                    <CardItem
                      translateZ={20}
                      as="a"
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white underline"
                    >
                      View on Amazon →
                    </CardItem>
                  </div>
                  
                  {/* Notification bell button */}
                  <CardItem
                    as="button"
                    onClick={() => handleclick(product)}
                    className="p-2 text-gray-700 hover:text-blue-500 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-bell-ring-icon lucide-bell-ring"
                    >
                      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                      <path d="M22 8c0-2.3-.8-4.3-2-6" />
                      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                      <path d="M4 2C2.8 3.7 2 5.7 2 8" />
                    </svg>
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
        </>
      )}
    </div>
  </div>
  );
}