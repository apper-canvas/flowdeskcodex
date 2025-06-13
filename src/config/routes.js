import DashboardPage from '@/components/pages/DashboardPage';
import ContactsPage from '@/components/pages/ContactsPage';
import DealsPage from '@/components/pages/DealsPage';
import ActivitiesPage from '@/components/pages/ActivitiesPage';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
component: ContactsPage
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'Target',
component: DealsPage
  },
  activities: {
    id: 'activities',
    label: 'Activities',
    path: '/activities',
    icon: 'Clock',
component: ActivitiesPage
  }
};

export const routeArray = Object.values(routes);