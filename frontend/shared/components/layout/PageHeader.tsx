import { Container } from './Container';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-muted/20">
      <Container className="py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-base text-muted-foreground max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </Container>
    </div>
  );
}
