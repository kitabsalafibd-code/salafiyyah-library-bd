import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ErrorBoundary from './components/ErrorBoundary'
import CompareFloatingBar from './components/CompareFloatingBar'
import ScrollToTop from './components/ScrollToTop'

// Lazy loaded pages
import AdminPage from './pages/AdminPage'
import DashboardPage from './pages/DashboardPage'

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'))
const BooksPage = lazy(() => import('./pages/BooksPage'))
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'))
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'))
const WritersPage = lazy(() => import('./pages/WritersPage'))
const WriterDetailPage = lazy(() => import('./pages/WriterDetailPage'))
const PublishersPage = lazy(() => import('./pages/PublishersPage'))
const PublisherDetailPage = lazy(() => import('./pages/PublisherDetailPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const QuranPage = lazy(() => import('./pages/QuranPage'))
const SurahDetailPage = lazy(() => import('./pages/SurahDetailPage'))
const HadithPage = lazy(() => import('./pages/HadithPage'))
const HadithChaptersPage = lazy(() => import('./pages/HadithChaptersPage'))
const HadithDetailPage = lazy(() => import('./pages/HadithDetailPage'))
const SalahTimesPage = lazy(() => import('./pages/SalahTimesPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const AIChatPage = lazy(() => import('./pages/AIChatPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const TopBooksPage = lazy(() => import('./pages/TopBooksPage'))
const AsmaulHusnaPage = lazy(() => import('./pages/AsmaulHusnaPage'))
const DuaPage = lazy(() => import('./pages/DuaPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ErrorBoundary>
              <Routes location={location}>
                {/* Admin Route - Direct, No Suspense */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                {/* Other Routes - Lazy Loaded */}
                <Route path="*" element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/books" element={<BooksPage />} />
                      <Route path="/books/:id" element={<BookDetailPage />} />
                      <Route path="/writers" element={<WritersPage />} />
                      <Route path="/writers/:id" element={<WriterDetailPage />} />
                      <Route path="/publishers" element={<PublishersPage />} />
                      <Route path="/publishers/:id" element={<PublisherDetailPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <DashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/quran" element={<QuranPage />} />
                      <Route path="/quran/:number" element={<SurahDetailPage />} />
                      <Route path="/hadith" element={<HadithPage />} />
                      <Route path="/hadith/:bookSlug" element={<HadithChaptersPage />} />
                      <Route path="/hadith/:bookSlug/:chapterNumber" element={<HadithDetailPage />} />
                      <Route path="/salah" element={<SalahTimesPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route
                        path="/ai"
                        element={
                          <ProtectedRoute>
                            <AIChatPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/top-books" element={<TopBooksPage />} />
                      <Route path="/asmaul-husna" element={<AsmaulHusnaPage />} />
                      <Route path="/dua" element={<DuaPage />} />
                      <Route path="/about" element={<AboutPage />} />
                    </Routes>
                  </Suspense>
                } />
              </Routes>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>
      <CompareFloatingBar />
      <Footer />
    </div>
  )
}

export default App
