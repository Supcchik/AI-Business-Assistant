"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoadingView() {
  return (
    <div className="container mx-auto p-6 pb-0 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Table header skeleton */}
            <div className="grid grid-cols-6 gap-4 pb-3 border-b">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            
            {/* Table rows skeleton */}
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-6 gap-4 py-3 border-b last:border-b-0">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <Skeleton 
                    key={colIndex} 
                    className={`h-4 ${
                      colIndex === 0 ? 'w-24' : 
                      colIndex === 1 ? 'w-32' : 
                      colIndex === 2 ? 'w-20' : 
                      colIndex === 3 ? 'w-16' : 
                      colIndex === 4 ? 'w-20' : 'w-16'
                    }`} 
                  />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
