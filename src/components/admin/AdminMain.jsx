import React, { useEffect, useState } from 'react'
import { Layout, Menu, Button, Popover } from 'antd';
import {
    FiImage,
    FiLogOut,
    FiSettings,
    FiHome,
    FiShoppingCart,
    FiPackage,
} from 'react-icons/fi';
import logo from '../../assets/mickey-logo.png'
import { useAuthStore } from '../../store/authStore/index'
import { useActions } from '../../actions/admin'
import { useNavigate } from 'react-router'
import { RiAdminFill } from "react-icons/ri";
import _ from 'underscore'

import Categories from './Categories';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import SettingsPage from './SettingsPage';
import ManageOrder from './ManageOrder';
import Dashboard from './Dashboard';

const { Header, Sider, Content } = Layout;


export default function AdminMain() {

    const { user, isAuthenticated } = useAuthStore()
    const { getAllCategory, getAllProductsAdmin, getSettings, logoutAdmin, getAllOrders } = useActions()
    const navigate = useNavigate()
    const [key, setKey] = useState("dashboard")

    useEffect(() => {
        if (_.isEmpty(user))
            navigate('/admin')
    }, [user])

    useEffect(() => {
        if (isAuthenticated) {
            console.log(isAuthenticated)
            getAllCategory()
            getAllProductsAdmin()
            getSettings()
            getAllOrders()
        }
    }, [isAuthenticated])

    const ProfileMenu = () => {
        return (
            <div className='w-[120px]' >
                <p className='text-xs text-center font-medium my-3' >{user?.displayName}</p>
                <Button className='w-full' icon={<FiLogOut />} onClick={() => { logoutAdmin() }} >Logout</Button>
            </div>
        )
    };

    const items = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: <FiHome />,
        },
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
        },
        {
            key: 'manage-order',
            label: 'Manage Order',
            icon: <FiPackage />,
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: <FiSettings />,
        },
        // {
        //     key: 'grp',
        //     label: 'Group',
        //     type: 'group',
        //     children: [
        //         { key: '13', label: 'Option 13' },
        //         { key: '14', label: 'Option 14' },
        //     ],
        // },
    ];

    return (
        <Layout style={{ minHeight: '100vh', maxHeight: "100vh" }}>
            <Sider breakpoint="lg"
                collapsedWidth="0" className='px-2' >
                <div className="flex justify-center text-white text-center py-4 text-xl font-bold">
                    <img className='w-[80px] rounded-xl' src={logo} alt='mickey crackers' />
                </div>
                <Menu theme="dark" mode="inline" items={items} defaultSelectedKeys={['dashboard']} selectedKeys={[key]} onClick={({ key }) => {
                    setKey(key)
                }} />
            </Sider>

            <Layout>
                <Header className="border-l border-white px-0 flex justify-end items-center shadow" style={{ padding: "20px" }}>
                    <Popover content={<ProfileMenu />} trigger='hover' placement='bottomLeft' >
                        <div className='bg-gradient-to-r from-indigo-500 to-blue-400 p-3 rounded-full cursor-pointer' >
                            <RiAdminFill className='text-lg text-white' />
                        </div>
                    </Popover>
                </Header>

                <Content className="bg-gray-50 h-full overflow-y-auto">
                    {
                        key == 'dashboard' && <Dashboard />
                    }
                    {
                        key == "categories" && <Categories />
                    }
                    {
                        key == "add-product" && <AddProduct />
                    }
                    {
                        key == "manage-product" && <ManageProducts />
                    }
                    {
                        key == "manage-order" && <ManageOrder />
                    }
                    {
                        key == "settings" && <SettingsPage />
                    }
                </Content>
            </Layout>
        </Layout>
    )
}
