'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Chrome as Home, ShoppingCart, MessageCircle, User, Search, Package, ChartBar as BarChart3 } from 'lucide-react';

interface MobileNavigationProps {
  userRole: 'farmer' | 'buyer';
}

export function MobileNavigation({ userRole }: MobileNavigationProps) {
  const pathname = usePathname();

  const farmerNavItems = [
    { href: '/farmer/dashboard', icon: Home, label: 'Home' },
    { href: '/marketplace', icon: Search, label: 'Browse' },
    { href: '/farmer/crops', icon: Package, label: 'My Crops' },
    { href: '/chat', icon: MessageCircle, label: 'AI Chat' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  const buyerNavItems = [
    { href: '/buyer/dashboard', icon: Home, label: 'Home' },
    { href: '/marketplace', icon: Search, label: 'Browse' },
    { href: '/buyer/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/chat', icon: MessageCircle, label: 'AI Chat' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  const navItems = userRole === 'farmer' ? farmerNavItems : buyerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 text-xs transition-colors',
                isActive 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-600 hover:text-green-600'
              )}
            >
              <IconComponent className={cn(
                'h-5 w-5',
                isActive ? 'text-green-600' : 'text-gray-600'
              )} />
              <span className={cn(
                'text-xs',
                isActive ? 'text-green-600 font-medium' : 'text-gray-600'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}