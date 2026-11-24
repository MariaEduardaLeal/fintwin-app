import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Bot,
  CalendarRange,
  Landmark,
  LayoutDashboard,
} from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { AdvisorScreen } from '../screens/main/AdvisorScreen';
import { BankTransactionsScreen } from '../screens/main/BankTransactionsScreen';
import { ConnectBankScreen } from '../screens/main/ConnectBankScreen';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { TimelineScreen } from '../screens/main/TimelineScreen';
import { useAuthStore } from '../store/useAuthStore';
import type { DashboardBankAccount } from '../types/api';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Timeline: undefined;
  Advisor: undefined;
  ConnectBank: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  BankTransactions: { bankAccount: DashboardBankAccount };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();

function DashboardIcon({ color, size }: { color: string; size: number }) {
  return <LayoutDashboard color={color} size={size} />;
}

function TimelineIcon({ color, size }: { color: string; size: number }) {
  return <CalendarRange color={color} size={size} />;
}

function AdvisorIcon({ color, size }: { color: string; size: number }) {
  return <Bot color={color} size={size} />;
}

function BankIcon({ color, size }: { color: string; size: number }) {
  return <Landmark color={color} size={size} />;
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#090D16' },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabsNavigator() {
  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: '#1E293B',
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <MainTabs.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Início',
          tabBarIcon: DashboardIcon,
        }}
      />
      <MainTabs.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          title: 'Renda',
          tabBarIcon: TimelineIcon,
        }}
      />
      <MainTabs.Screen
        name="Advisor"
        component={AdvisorScreen}
        options={{
          title: 'Conselheiro',
          tabBarIcon: AdvisorIcon,
        }}
      />
      <MainTabs.Screen
        name="ConnectBank"
        component={ConnectBankScreen}
        options={{
          title: 'Bancos',
          tabBarIcon: BankIcon,
        }}
      />
    </MainTabs.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#090D16' },
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabsNavigator} />
      <MainStack.Screen
        name="BankTransactions"
        component={BankTransactionsScreen}
      />
    </MainStack.Navigator>
  );
}

export function RootNavigator() {
  const { token, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return token ? <MainNavigator /> : <AuthNavigator />;
}
