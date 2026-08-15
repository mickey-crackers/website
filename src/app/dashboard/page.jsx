"use client";
import React, { useEffect, useState } from 'react'
import { Layout, Menu, Popover } from 'antd';
import {
    FiLogOut,
    FiSettings,
    FiHome,
    FiShoppingCart,
    FiPackage,
    FiTag,
    FiLock
} from 'react-icons/fi';
import logo from '../../assets/mickey-logo.png'
import { useAuthStore } from '../../store/authStore/index'
import { useActions } from '../../actions/admin'
import { useRouter } from 'next/navigation'
import { RiAdminFill } from "react-icons/ri";
import _ from 'underscore'

import Categories from '../../components/admin/Categories';
import AddProduct from '../../components/admin/AddProduct';
import ManageProducts from '../../components/admin/ManageProducts';
import SettingsPage from '../../components/admin/SettingsPage';
import ManageOrder from '../../components/admin/ManageOrder';
import Dashboard from '../../components/admin/Dashboard';
import CouponManagement from '../../components/admin/CouponManagement';
import PasscodeManager from '../../components/admin/PasscodeManager';

const { Header, Sider, Content } = Layout;

export default function AdminMain() {
    const { user, isAuthenticated } = useAuthStore()
    const { getAllCategory, getAllProductsAdmin, getSettings, logoutAdmin, getAllOrders, getAllCoupons } = useActions()
    const router = useRouter()
    const [key, setKey] = useState("dashboard")

    const isSalesman = user?.role === 'Salesman';

    useEffect(() => {
        if (_.isEmpty(user))
            router.push('/admin')
    }, [user, router])

    useEffect(() => {
        if (isSalesman && !['dashboard', 'manage-order'].includes(key)) {
            setKey('dashboard');
        }
    }, [key, isSalesman]);

    useEffect(() => {
        if (isAuthenticated) {
            if (!isSalesman) {
                getAllCategory()
                getAllProductsAdmin()
                getSettings()
                getAllCoupons()
            }
            getAllOrders()
        }
    }, [isAuthenticated, isSalesman])

    const ProfileMenu = () => {
        return (
            <div className="w-[130px] flex flex-col items-center gap-2 p-1" >
                <p className="text-xs text-center font-bold text-gray-300 m-0" >{user?.displayName}</p>
                <button
                    onClick={() => { logoutAdmin() }}
                    className="cursor-pointer w-full bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-red-500 text-white text-xs font-semibold py-1.5 rounded-lg transition-all duration-300"
                >
                    Logout
                </button>
            </div>
        )
    };

    const items = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: <FiHome />,
        },
        ...(!isSalesman ? [
            {
                key: 'products',
                label: 'Products',
                icon: <FiShoppingCart />,
                children: [
                    { key: 'categories', label: 'Categories' },
                    { key: 'add-product', label: 'Add Product' },
                    { key: 'manage-product', label: 'Manage Products' },
                ],
            },
            {
                type: 'divider',
            }
        ] : []),
        {
            key: 'manage-order',
            label: 'Manage Order',
            icon: <FiPackage />,
        },
        ...(!isSalesman ? [
            {
                key: 'coupons',
                label: 'Coupons',
                icon: <FiTag />,
            },
            {
                key: 'passcodes',
                label: 'Passcodes',
                icon: <FiLock />,
            },
            {
                key: 'settings',
                label: 'Settings',
                icon: <FiSettings />,
            },
        ] : [])
    ];

    return (
        <Layout style={{ minHeight: '100vh', maxHeight: "100vh" }} className="bg-[#0a0a0a]">
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                className="px-2 !bg-[#0c0c0c] border-r border-neutral-900/60"
            >
                <div className="flex justify-center text-white text-center py-4 text-xl font-bold">
                    <img className="w-[80px] rounded-xl shadow-lg border border-[#D4AF37]/20" src={logo.src || logo} alt="mickey crackers" />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={items}
                    defaultSelectedKeys={['dashboard']}
                    selectedKeys={[key]}
                    onClick={({ key }) => {
                        setKey(key)
                    }}
                    className="!bg-[#0c0c0c]"
                />
            </Sider>

            <Layout className="bg-[#0a0a0a]">
                <Header
                    className="!bg-[#0c0c0c] border-l border-neutral-900/40 border-b border-neutral-900/60 px-6 flex justify-end items-center shadow-lg"
                    style={{ padding: "20px", height: "64px" }}
                >
                    <Popover content={<ProfileMenu />} trigger="hover" placement="bottomLeft" >
                        <div className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] p-2.5 rounded-full cursor-pointer hover:brightness-110 shadow-md transition duration-300" >
                            <RiAdminFill className="text-base text-black" />
                        </div>
                    </Popover>
                </Header>

                <Content className="bg-[#0a0a0a] text-white h-full overflow-y-auto">
                    {
                        key === 'dashboard' && <Dashboard />
                    }
                    {
                        key === "categories" && <Categories />
                    }
                    {
                        key === "add-product" && <AddProduct />
                    }
                    {
                        key === "manage-product" && <ManageProducts />
                    }
                    {
                        key === "manage-order" && <ManageOrder />
                    }
                    {
                        key === "settings" && <SettingsPage />
                    }
                    {
                        key === "coupons" && <CouponManagement />
                    }
                    {
                        key === "passcodes" && <PasscodeManager />
                    }
                </Content>
            </Layout>
        </Layout>
    )
}
