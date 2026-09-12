const Header = () => {
  return (
    <header className="border-b border-soc-border bg-soc-card/85 px-5 py-4 shadow-sm backdrop-blur sm:px-8">
      <div className="flex items-center justify-between pl-12 sm:pl-10 lg:pl-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soc-primary">Security workspace</p>
          <h1 className="mt-1 text-xl font-bold text-soc-text">IPsec AI command center</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
