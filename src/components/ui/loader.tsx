import { cn } from "@/lib/utils"

export function Loader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full", className)}
      {...props}
    />
  )
}
