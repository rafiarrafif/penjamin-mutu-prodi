import { Link, createFileRoute } from '@tanstack/react-router'
import { useAuth } from '#/auth/auth-context'
import { BrandLockup } from '#/components/layout/brand-lockup'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink-primary">
      <header className="border-b border-border-default bg-surface">
        <div className="mx-auto flex h-[56px] max-w-[1120px] items-center justify-between px-6 lg:px-10">
          <BrandLockup to="/" />
          <nav className="flex items-center gap-6 text-[13px] font-medium text-ink-secondary">
            <a href="#cakupan" className="hover:text-ink-primary no-underline">
              Panduan Mutu
            </a>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="font-semibold text-brand-deep hover:underline no-underline"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="font-semibold text-brand-deep hover:underline no-underline"
              >
                Masuk
              </Link>
            )}
          </nav>
        </div>
      </header>

      <section className="bg-canvas">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-20">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-deep">
              Sistem Penjaminan Mutu Program Studi
            </p>
            <h1 className="m-0 text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-ink-primary sm:text-[42px]">
              Mutu terjaga.
              <br />
              Bukti tertata.
            </h1>
            <p className="mt-3.5 max-w-[460px] text-[14.5px] leading-[1.6] text-ink-muted">
              Kelola kategori dokumen penjaminan mutu, struktur departemen,
              provisi akun, serta tata kelola peran dosen dan direktur dalam
              satu portal terstruktur.
            </p>

            <div className="mt-6 flex flex-col items-start gap-2.5">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="deep" size="lg">
                    Buka Workspace Mutu
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="deep" size="lg">
                    Masuk ke Portal Mutu
                  </Button>
                </Link>
              )}
              <a
                href="#cakupan"
                className="text-[12.5px] font-medium text-brand-deep no-underline hover:underline"
              >
                Lihat cakupan sistem penjaminan mutu &rarr;
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <svg
              width="300"
              height="220"
              viewBox="0 0 280 210"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="145"
                cy="105"
                r="88"
                fill="#E6F2FA"
                stroke="#D1E6F5"
                strokeDasharray="4 4"
              />
              <rect
                x="64"
                y="34"
                width="114"
                height="136"
                rx="8"
                fill="#FFFFFF"
                stroke="#D5E3EE"
                strokeWidth="1.5"
              />
              <rect x="98" y="27" width="46" height="12" rx="4" fill="#005C7C" />
              <rect x="80" y="52" width="54" height="6" rx="3" fill="#005C7C" />
              <circle cx="86" cy="80" r="6" fill="#EDF6FD" stroke="#4E9AC7" />
              <rect x="98" y="77" width="62" height="5" rx="2.5" fill="#18181B" />
              <circle cx="86" cy="106" r="6" fill="#EDF6FD" stroke="#4E9AC7" />
              <rect x="98" y="103" width="50" height="5" rx="2.5" fill="#98A2B3" />
              <circle cx="86" cy="132" r="6" fill="#EDF6FD" stroke="#4E9AC7" />
              <rect x="98" y="129" width="58" height="5" rx="2.5" fill="#18181B" />
              <rect
                x="172"
                y="48"
                width="58"
                height="44"
                rx="6"
                fill="#FFFFFF"
                stroke="#D5E3EE"
              />
              <rect x="184" y="72" width="7" height="11" rx="1.5" fill="#7CC0E6" />
              <rect x="196" y="65" width="7" height="18" rx="1.5" fill="#4E9AC7" />
              <rect x="208" y="58" width="7" height="25" rx="1.5" fill="#005C7C" />
              <path
                d="M188 108L216 119V141C216 159 204 174 188 180C172 174 160 159 160 141V119L188 108Z"
                fill="#005C7C"
              />
              <path
                d="M178 143L185 150L199 135"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      <section
        id="cakupan"
        className="flex-1 border-t border-border-default bg-surface py-11"
      >
        <div className="mx-auto max-w-[1040px] px-6 lg:px-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="m-0 text-[15px] font-semibold text-ink-primary">
              Cakupan Portal Penjaminan Mutu
            </h2>
            <Link
              to="/login"
              className="text-[12.5px] font-medium text-brand-deep no-underline hover:underline"
            >
              Akses Portal &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[8px] border border-border-tinted bg-surface-tinted p-5">
              <div className="mb-3 grid h-7 w-7 place-items-center rounded-[6px] border border-border-tinted bg-surface text-[12px] font-bold text-brand-deep">
                01
              </div>
              <h3 className="m-0 mb-1.5 text-[14px] font-semibold text-ink-primary">
                Kategori &amp; Standar Data
              </h3>
              <p className="m-0 text-[12.5px] leading-relaxed text-ink-muted">
                Pengelolaan kategori dokumen mutu beserta pemetaan kebutuhan
                bukti berkala per prodi.
              </p>
            </div>

            <div className="rounded-[8px] border border-border-tinted bg-surface-tinted p-5">
              <div className="mb-3 grid h-7 w-7 place-items-center rounded-[6px] border border-border-tinted bg-surface text-[12px] font-bold text-brand-deep">
                02
              </div>
              <h3 className="m-0 mb-1.5 text-[14px] font-semibold text-ink-primary">
                Manajemen Akun &amp; Departemen
              </h3>
              <p className="m-0 text-[12.5px] leading-relaxed text-ink-muted">
                Provisi akun dosen, verifikator, admin, dan direktur dengan
                kontrol peran terverifikasi.
              </p>
            </div>

            <div className="rounded-[8px] border border-border-tinted bg-surface-tinted p-5">
              <div className="mb-3 grid h-7 w-7 place-items-center rounded-[6px] border border-border-tinted bg-surface text-[12px] font-bold text-brand-deep">
                03
              </div>
              <h3 className="m-0 mb-1.5 text-[14px] font-semibold text-ink-primary">
                Autentikasi Google OAuth
              </h3>
              <p className="m-0 text-[12.5px] leading-relaxed text-ink-muted">
                Akses aman berbasis sesi JWT yang tercatat dan dapat dicabut
                sewaktu-waktu saat keluar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-default bg-surface py-4 text-[12px] text-ink-muted">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-2 px-6 lg:px-10">
          <span>&copy; 2026 SIMUTU — Sistem Penjaminan Mutu Program Studi</span>
          <span>v1.0 &middot; Academic Quality Assurance</span>
        </div>
      </footer>
    </div>
  )
}
