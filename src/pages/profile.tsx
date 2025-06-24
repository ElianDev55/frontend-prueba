import Navbar from "../components/navbar"
import { useGetUserById } from "../hooks/useUsers"

export const Profile = () => {
  const { user, loading } = useGetUserById()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile data.</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.data.name}</h2>
              <p className="text-gray-600 mb-4">{user.data.email}</p>

              {/* Account Info */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">User ID:</span>
                  <span className="font-mono text-gray-700">#{user.data.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Member since:</span>
                  <span className="text-gray-700">{new Date(user.data.created_at).getFullYear()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.data.name}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.data.email}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.data.phone}</p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                    {user.data.address || "No address provided"}
                  </p>
                </div>
              </div>

              {/* Account Timestamps */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Activity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Account Created</p>
                    <p className="text-gray-900 font-medium">{formatDate(user.data.created_at)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="text-gray-900 font-medium">{formatDate(user.data.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
