import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating = 0,
  maxRating = 5,
  interactive = false,
  onRatingChange,
  size = "md",
  className = "",
}) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const currentDisplayRating = hoverRating || rating;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentDisplayRating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "transition-transform",
              interactive ? "cursor-pointer hover:scale-110 focus:outline-none" : "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size] || sizeClasses.md,
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "text-zinc-600 fill-transparent"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
