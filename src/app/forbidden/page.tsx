import Link from "next/link"
import { ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldX className="w-16 h-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-bold text-foreground">403</h1>
          <h2 className="text-2xl font-semibold text-foreground">Không có quyền truy cập</h2>
          <p className="text-muted-foreground text-balance">
            Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là
            lỗi.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/home">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
