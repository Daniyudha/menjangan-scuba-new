interface PageHeaderProps {
  title: string;
  buttonLabel?: string;
  buttonHref?: string;
}

const PageHeader = ({ title, buttonLabel, buttonHref }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-light-slate">{title}</h1>
      {buttonLabel && buttonHref && (
        <a href={buttonHref} className="btn-primary">
          {buttonLabel}
        </a>
      )}
    </div>
  );
};

export default PageHeader;