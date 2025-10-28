import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { Toaster } from '../components/Toaster';
import { SessionHydrator } from '../components/SessionHydrator';

export const metadata: Metadata = {
  title: 'SmartWorker Connect',
  description: 'Connect with trusted smart-home and electrical professionals in your area.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <SessionHydrator />
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-brand">
                <span className="h-3 w-3 rounded-full bg-brand-accent"></span>
                SmartWorker Connect
              </div>
              <nav className="flex items-center gap-6 text-sm font-medium text-brand-muted">
                <a href="/projects">Projects</a>
                <a href="/workers">Workers</a>
                <a href="/(auth)/login" className="button-primary text-sm">
                  Sign in
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between">
              <p>&copy; {new Date().getFullYear()} SmartWorker Connect. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
