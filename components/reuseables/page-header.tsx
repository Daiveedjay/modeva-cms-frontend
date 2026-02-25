interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg sm:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="max-w-[3/4] sm:max-w-full text-sm sm:text-base text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
