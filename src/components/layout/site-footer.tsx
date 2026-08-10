import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/brand/logo";
import { useI18n } from "@/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{t("brand.tagline")}</p>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-muted-foreground">
            {t("hero.disclaimer")}
          </p>
        </div>
        <nav aria-label="Platform" className="text-sm">
          <p className="font-display text-sm font-semibold text-foreground">Platform</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/report" className="hover:text-foreground">
                {t("nav.report")}
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-foreground">
                {t("nav.track")}
              </Link>
            </li>
            <li>
              <Link to="/explore" className="hover:text-foreground">
                {t("nav.explore")}
              </Link>
            </li>
            <li>
              <Link to="/suggestions" className="hover:text-foreground">
                {t("nav.suggestions")}
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-foreground">
                {t("nav.how")}
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Policies" className="text-sm">
          <p className="font-display text-sm font-semibold text-foreground">Policies</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/guidelines" className="hover:text-foreground">
                Submission Guidelines
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="h-1 w-full tricolor-rule" aria-hidden />
      <div className="mx-auto w-full max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
        © {year} Surya Group of Industries. Surya JanSeva is a citizen platform and is not a
        government authority.
      </div>
    </footer>
  );
}
