import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AgendaScreen    from '../screens/agenda/AgendaScreen';
import FinancesScreen  from '../screens/finances/FinancesScreen';
import HydrationScreen from '../screens/hydration/HydrationScreen';
import MoreScreen      from '../screens/more/MoreScreen';
import { MainTabParamList } from '../types';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconsName; inactive: IoniconsName }> = {
  Dashboard: { active: 'home',        inactive: 'home-outline' },
  Agenda:    { active: 'calendar',    inactive: 'calendar-outline' },
  Finances:  { active: 'wallet',      inactive: 'wallet-outline' },
  Hydration: { active: 'water',       inactive: 'water-outline' },
  More:      { active: 'grid',        inactive: 'grid-outline' },
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor:  COLORS.border,
          paddingBottom:   4,
          height:          60,
        },
        tabBarIcon: ({ focused, size }) => {
          const icons = TAB_ICONS[route.name];
          const name  = focused ? icons.active : icons.inactive;
          return <Ionicons name={name} size={size} color={focused ? COLORS.primary : COLORS.textMuted} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Agenda"    component={AgendaScreen}    options={{ tabBarLabel: 'Agenda' }} />
      <Tab.Screen name="Finances"  component={FinancesScreen}  options={{ tabBarLabel: 'Finanças' }} />
      <Tab.Screen name="Hydration" component={HydrationScreen} options={{ tabBarLabel: 'Água' }} />
      <Tab.Screen name="More"      component={MoreScreen}      options={{ tabBarLabel: 'Mais' }} />
    </Tab.Navigator>
  );
}
