import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Ticket', href: '/tickets/new'},
    currentUser && { label: 'My Orders', href: '/orders'},
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter(Boolean)
    .map(({ label, href }) => (
      <Link 
        key={href}
        href={href}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
      >
        {label}
      </Link>
    ));

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">Ticketing</span>
          </Link>
          <nav className="flex space-x-8 items-center">
            {links}
          </nav>
        </div>
      </div>
    </header>
  );
};