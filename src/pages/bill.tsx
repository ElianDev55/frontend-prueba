import { useMemo } from "react"
import BillCard from "../components/bill-card"
import Navbar from "../components/navbar"
import { useGetBillsByUser } from "../hooks/useBills"
import type { BillDetail } from "../interfaces/bill-by-user.interface"

export const Bills = () => {
  const { bills, loading } = useGetBillsByUser()

  const billsById = useMemo(() => {
    if (!bills || !bills.data) {
      return {}
    }
    const allBillDetails = Object.values(bills.data).flat()
    return allBillDetails.reduce(
      (acc, detail) => {
        const billId = detail.bill_id
        if (!acc[billId]) {
          acc[billId] = []
        }
        acc[billId].push(detail)
        return acc
      },
      {} as { [key: string]: BillDetail[] },
    )
  }, [bills])

  const billGroups = Object.values(billsById)

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bills...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}

        {/* Bills Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {billGroups.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
              <p className="text-gray-600">Create your first bill to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {billGroups.map(billDetails => {
                const bill = billDetails[0].bill
                return <BillCard key={bill.id} bill={bill} billDetail={billDetails} />
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}


