import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useRegister } from "../hooks/useAutorization"

interface RegisterForm {
  name: string
  email: string
  phone: string
  address: string
  password: string
}

export default function RegisterPage() {

    const { register, loading, error } = useRegister()
    const navigate = useNavigate()


  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<RegisterForm>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name as keyof RegisterForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await register(formData)
      console.log("Registration response:", response)
      if (response.status === 201) {
        Swal.fire({
          title: "Registration successful!",
          icon: "success",
          draggable: true
        });
        navigate("/login")
      } else if (response.statusCode === 400) {
        Swal.fire({
          title: response.message,
          icon: "error",
          draggable: true
        });
      } else {
        Swal.fire({
          title: error || "Registration failed!",
          icon: "error",
          draggable: true
        });
      }

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      })
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Food<span className="text-cyan-500">App</span>
          </h2>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Create Account</h3>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8  m-0">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Full Name */}
            <div className="flex flex-col col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0000000000"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div className="flex flex-col col-span-1">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col col-span-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <div className="col-span-1 sm:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-500 hover:text-cyan-600 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
