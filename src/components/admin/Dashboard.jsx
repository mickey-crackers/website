"use client";
import React, { useMemo } from "react";
import { Table, Tag, Progress, Row, Col } from "antd";
import {
    FiShoppingCart,
    FiClock,
    FiTag,
    FiTrendingUp
} from "react-icons/fi";
import { useAdminStore } from "../../store/adminStore";
import dayjs from "dayjs";

export default function Dashboard() {
    const { coupons, orders } = useAdminStore();

    // 1. Calculate Dashboard Metrics
    const metrics = useMemo(() => {
        let totalSales = 0;
        let pendingRevenue = 0;

        orders?.forEach((order) => {
            const amount = order?.cart?.totalAmount || 0;
            if (order?.paymentStatus === 'Paid') {
                totalSales += amount;
            } else {
                pendingRevenue += amount;
            }
        });

        const activeCoupons = coupons?.filter(c => c.isActive)?.length || 0;

        return {
            totalSales,
            pendingRevenue,
            totalOrders: orders?.length || 0,
            activeCoupons
        };
    }, [orders, coupons]);

    // 2. Format Recent Orders
    const recentOrdersData = useMemo(() => {
        return orders?.slice(0, 5).map((order) => ({
            key: order.id,
            orderID: order.orderID,
            customerName: order.customerData?.fullName || 'N/A',
            customerPhone: order.customerData?.phone || 'N/A',
            orderedAt: order.orderedAt,
            totalAmount: order.cart?.totalAmount || 0,
            orderStatus: order.orderStatus || 'Waiting for Payment',
            paymentStatus: order.paymentStatus || 'Not Paid'
        }));
    }, [orders]);

    // 3. Format Active Coupons
    const activeCouponsData = useMemo(() => {
        return coupons?.filter(c => c.isActive).slice(0, 5);
    }, [coupons]);

    // Ant Design Columns for Recent Orders Table
    const orderColumns = [
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Order ID</span>,
            dataIndex: "orderID",
            key: "orderID",
            render: (id) => <span className="font-bold text-[#D4AF37] font-mono text-xs">{id}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Customer</span>,
            key: "customer",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-white text-xs">{record.customerName}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{record.customerPhone}</span>
                </div>
            )
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Date</span>,
            dataIndex: "orderedAt",
            key: "orderedAt",
            render: (date) => <span className="text-gray-300 text-xs">{dayjs(date).format('DD MMM YY, hh:mm A')}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Amount</span>,
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (amt) => <span className="font-bold text-amber-100 text-xs">₹{amt.toLocaleString('en-IN')}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Order Status</span>,
            dataIndex: "orderStatus",
            key: "orderStatus",
            render: (status) => {
                let color = "orange";
                if (status === "Order Processing") color = "blue";
                if (status === "Out for Delivery") color = "green";
                return <Tag color={color} className="text-[10px] uppercase font-bold tracking-wider">{status}</Tag>;
            }
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Payment</span>,
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (status) => (
                <Tag color={status === "Paid" ? "green" : "red"} className="font-bold text-[10px] uppercase tracking-wider">
                    {status}
                </Tag>
            )
        }
    ];

    return (
        <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white m-0 uppercase">Store Overview</h2>
                <p className="text-gray-400 text-xs mt-1">Monitor sales metrics, order requests, and coupon claims</p>
            </div>

            {/* Metrics Cards Grid */}
            <Row gutter={[20, 20]} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                    <div className="bg-[#121212]/90 border border-neutral-900 p-5 rounded-2xl shadow-lg flex items-center justify-between h-full">
                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Sales (Paid)</span>
                            <span className="text-xl font-extrabold mt-1 text-[#D4AF37] block">₹{metrics.totalSales.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-neutral-950 text-emerald-400 p-3.5 rounded-xl border border-neutral-850 text-xl flex justify-center items-center">
                            <FiTrendingUp />
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <div className="bg-[#121212]/90 border border-neutral-900 p-5 rounded-2xl shadow-lg flex items-center justify-between h-full">
                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Pending Collections</span>
                            <span className="text-xl font-extrabold mt-1 text-orange-400 block">₹{metrics.pendingRevenue.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-neutral-950 text-orange-400 p-3.5 rounded-xl border border-neutral-850 text-xl flex justify-center items-center">
                            <FiClock />
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <div className="bg-[#121212]/90 border border-neutral-900 p-5 rounded-2xl shadow-lg flex items-center justify-between h-full">
                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Orders</span>
                            <span className="text-xl font-extrabold mt-1 text-blue-400 block">{metrics.totalOrders}</span>
                        </div>
                        <div className="bg-neutral-950 text-blue-400 p-3.5 rounded-xl border border-neutral-850 text-xl flex justify-center items-center">
                            <FiShoppingCart />
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <div className="bg-[#121212]/90 border border-neutral-900 p-5 rounded-2xl shadow-lg flex items-center justify-between h-full">
                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Active Coupons</span>
                            <span className="text-xl font-extrabold mt-1 text-indigo-400 block">{metrics.activeCoupons}</span>
                        </div>
                        <div className="bg-neutral-950 text-indigo-400 p-3.5 rounded-xl border border-neutral-850 text-xl flex justify-center items-center">
                            <FiTag />
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Split Tables Layout */}
            <Row gutter={[24, 24]}>
                {/* Recent Orders Column */}
                <Col xs={24} xl={16}>
                    <div className="bg-[#121212]/50 border border-neutral-900 rounded-2xl overflow-hidden shadow-xl p-5">
                        <h3 className="text-sm font-bold text-amber-100 uppercase tracking-wider mb-4">Recent Orders</h3>
                        <Table
                            dataSource={recentOrdersData}
                            columns={orderColumns}
                            pagination={false}
                            className="w-full text-white"
                        />
                    </div>
                </Col>

                {/* Coupons Tracker Column */}
                <Col xs={24} xl={8}>
                    <div className="bg-[#121212]/50 border border-neutral-900 rounded-2xl shadow-xl p-5 h-full flex flex-col">
                        <h3 className="text-sm font-bold text-amber-100 uppercase tracking-wider mb-4">Active Promotions Usage</h3>
                        {activeCouponsData && activeCouponsData.length > 0 ? (
                            <div className="flex flex-col gap-5 flex-grow justify-center">
                                {activeCouponsData.map((coupon) => {
                                    const claimed = coupon.claimedCount || 0;
                                    const max = coupon.maxClaims === 99999 ? 1000 : coupon.maxClaims;
                                    const percent = Math.round((claimed / max) * 100);

                                    return (
                                        <div key={coupon.id} className="border-b border-neutral-900/60 pb-3 last:border-b-0 last:pb-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-[#D4AF37] text-sm font-mono tracking-wider">{coupon.code}</span>
                                                <span className="text-[10px] text-gray-400 font-semibold uppercase">
                                                    {claimed} / {coupon.maxClaims === 99999 ? 'Unlimited' : coupon.maxClaims} Claims
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2">
                                                <span>
                                                    {coupon.type === 'free_packing' 
                                                        ? 'Free Secured Packing' 
                                                        : coupon.type === 'percentage' 
                                                            ? `${coupon.value}% Discount` 
                                                            : `₹${coupon.value} Flat Off`}
                                                </span>
                                                <span>Expires: {dayjs(coupon.endDate).format('DD MMM YY')}</span>
                                            </div>
                                            <Progress 
                                                percent={percent > 100 ? 100 : percent} 
                                                status={percent >= 90 ? "exception" : "normal"}
                                                strokeColor="#D4AF37"
                                                trailColor="#1e1e1e"
                                                showInfo={false}
                                                size="small"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500 text-xs font-light flex-grow flex items-center justify-center">
                                No active coupons found. Create coupons in the Coupons tab.
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
}
