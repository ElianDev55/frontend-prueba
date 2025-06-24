import type { Bill, BillDetail } from "../interfaces/bill-by-user.interface"

interface BillCardProps {
  bill: Bill
  billDetail: BillDetail[]
}

export default function BillCard({ bill, billDetail }: BillCardProps) {
  console.log(billDetail)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: string) => {
    return `$${Number.parseFloat(price).toFixed(2)}`
  }

  const getBillNumber = (id: string) => {
    return `#${id.slice(-6).toUpperCase()}`
  }

  const getTotalItems = () => {
    return billDetail.reduce((count: number, detail: BillDetail) => {
      if (detail.diches) count++;
      if (detail.add) count++;
      if (detail.souces && detail.souces.price && Number.parseFloat(detail.souces.price) > 0) count++;
      if (detail.drinks) count++;
      if (detail.chips) count++;
      return count;
    }, 0);
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{getBillNumber(bill.id || "")}</h3>
            <p className="text-cyan-100 text-sm">{formatDate(bill.created_at || "")}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatPrice(bill.total || "0")}</p>
            <p className="text-cyan-100 text-xs">{getTotalItems()} items</p>
          </div>
        </div>
      </div>

      {/* Main Dish Preview */}
      <div className="p-4">
        {billDetail.map((detail, index) => (
          detail.diches && detail.diches.name && detail.diches.price && (
            <div key={index} className="flex items-center space-x-3 mb-4">
              <img
                src={detail.diches.image || "/placeholder.svg"}
                alt={detail.diches.name}
                className="w-16 h-16 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">{detail.diches.name}</h4>
                <p className="text-sm text-gray-600">Main Dish</p>
                <p className="text-cyan-600 font-bold">{formatPrice(detail.diches.price)}</p>
              </div>
            </div>
          )
        ))}

        {/* Items Summary */}
        <div className="space-y-2 mb-4">
          {billDetail.map((detail, index) => (
            <div key={index}>
              {/* Add-on */}
              {detail.add && detail.add.name && detail.add.price && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    {detail.add.name}
                  </span>
                  <span className="font-medium text-gray-800">{formatPrice(detail.add.price)}</span>
                </div>
              )}

              {/* Drink */}
              {detail.drinks && detail.drinks.name && detail.drinks.price && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {detail.drinks.name}
                  </span>
                  <span className="font-medium text-gray-800">{formatPrice(detail.drinks.price)}</span>
                </div>
              )}

              {/* Chips */}
              {detail.chips && detail.chips.name && detail.chips.price && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    {detail.chips.name}
                  </span>
                  <span className="font-medium text-gray-800">{formatPrice(detail.chips.price)}</span>
                </div>
              )}

              {/* Sauce (only if has price) */}
              {detail.souces && detail.souces.name && Number.parseFloat(detail.souces.price) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    {detail.souces.name}
                  </span>
                  <span className="font-medium text-gray-800">{formatPrice(detail.souces.price)}</span>
                </div>
              )}

              {/* Free sauce indicator */}
              {detail.souces && detail.souces.name && Number.parseFloat(detail.souces.price) === 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {detail.souces.name}
                  </span>
                  <span className="text-green-600 font-medium text-xs">FREE</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <p>Bill ID: {getBillNumber(bill.id || "")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
