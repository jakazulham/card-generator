import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  // items: [{ label: string, to?: string }]
  // Last item is current page (no link)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.to ? `https://cetakkartu.com${item.to}` : undefined,
    })),
  };

  return (
    <>
      <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i}>
                {isLast ? (
                  <span aria-current="page">{item.label}</span>
                ) : item.to ? (
                  <Link to={item.to}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {!isLast && <span className="breadcrumb-sep">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </>
  );
}
