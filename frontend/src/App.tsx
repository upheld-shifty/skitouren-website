import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { HomePage } from './pages/public/HomePage'
import { TourDetailPage } from './pages/public/TourDetailPage'
import { StatsPage } from './pages/public/StatsPage'
import { NewsPage } from './pages/public/NewsPage'
import { PostDetailPage } from './pages/public/PostDetailPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { NotFoundPage } from './pages/public/NotFoundPage'
import { LoginPage } from './pages/admin/LoginPage'
import { AdminTourListPage } from './pages/admin/AdminTourListPage'
import { AdminTourCreatePage } from './pages/admin/AdminTourCreatePage'
import { AdminTourEditPage } from './pages/admin/AdminTourEditPage'
import { AdminPostListPage } from './pages/admin/AdminPostListPage'
import { AdminPostCreatePage } from './pages/admin/AdminPostCreatePage'
import { AdminPostEditPage } from './pages/admin/AdminPostEditPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

const router = createBrowserRouter([
  // Public routes
  { path: '/',               element: <HomePage /> },
  { path: '/tour/:slug',     element: <TourDetailPage /> },
  { path: '/statistiken',    element: <StatsPage /> },
  { path: '/news',           element: <NewsPage /> },
  { path: '/news/:slug',     element: <PostDetailPage /> },
  { path: '/404',            element: <NotFoundPage /> },
  { path: '*',               element: <NotFoundPage /> },

  // Auth pages (public)
  { path: '/anmelden',     element: <LoginPage /> },
  { path: '/admin/login',  element: <LoginPage /> },   // legacy alias
  { path: '/registrieren', element: <RegisterPage /> },

  // Admin protected area
  {
    element: <ProtectedRoute />,
    children: [{
      element: <AdminLayout />,
      children: [
        { path: '/admin',                   element: <Navigate to="/admin/tours" replace /> },
        { path: '/admin/tours',             element: <AdminTourListPage /> },
        { path: '/admin/tours/new',         element: <AdminTourCreatePage /> },
        { path: '/admin/tours/:id/edit',    element: <AdminTourEditPage /> },
        { path: '/admin/news',              element: <AdminPostListPage /> },
        { path: '/admin/news/new',          element: <AdminPostCreatePage /> },
        { path: '/admin/news/:id/edit',     element: <AdminPostEditPage /> },
      ],
    }],
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
