interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/** Section heading shared by every portal page. */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-serif text-2xl text-[#16233F]">{title}</h2>
        {description && <p className="mt-1 text-sm text-[#6B7280]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default PageHeader;
