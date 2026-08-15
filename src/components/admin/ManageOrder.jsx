"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Input, Segmented, Select, Row, Col, Button, Popconfirm, Card } from 'antd';
import Order from '../../components/Order';
import { useAdminStore } from '../../store/adminStore';
import { useActions } from '../../actions/admin';
import { FiRefreshCw } from 'react-icons/fi';

const { Option } = Select;

export default function ManageOrder() {
    const { orders } = useAdminStore();
    const { getAllOrders } = useActions();
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [sortBy, setSortBy] = useState('date-desc');
    const [refreshing, setRefreshing] = useState(false);
    
    const [filtered, setFiltered] = useState([]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getAllOrders();
        } catch (error) {
            console.error("Failed to refresh orders:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // 1. Calculate Status Statistics Counts
    const stats = useMemo(() => {
        let waiting = 0;
        let processing = 0;
        let outForDelivery = 0;

        orders?.forEach((order) => {
            if (order?.orderStatus === 'Waiting for Payment') waiting++;
            if (order?.orderStatus === 'Order Processing') processing++;
            if (order?.orderStatus === 'Out for Delivery') outForDelivery++;
        });

        return { waiting, processing, outForDelivery, total: orders?.length || 0 };
    }, [orders]);

    // 2. Perform Multi-Factor Filtering & Sorting
    useEffect(() => {
        let result = orders ? [...orders] : [];

        // Apply Search Filter
        if (search?.trim()) {
            const query = search.toLowerCase();
            result = result.filter((order) => 
                order?.customerData?.fullName?.toLowerCase()?.includes(query) ||
                order?.customerData?.phone?.toLowerCase()?.includes(query) ||
                order?.customerData?.email?.toLowerCase()?.includes(query) ||
                order?.orderID?.toLowerCase()?.includes(query)
            );
        }

        // Apply Status Filter
        if (statusFilter !== 'All') {
            result = result.filter((order) => order?.orderStatus === statusFilter);
        }

        // Apply Payment Status Filter
        if (paymentFilter !== 'All') {
            result = result.filter((order) => order?.paymentStatus === paymentFilter);
        }

        // Apply Sorting
        result.sort((a, b) => {
            const amountA = a?.cart?.totalAmount || 0;
            const amountB = b?.cart?.totalAmount || 0;
            const dateA = a?.orderedAt || 0;
            const dateB = b?.orderedAt || 0;

            if (sortBy === 'date-desc') return dateB - dateA;
            if (sortBy === 'date-asc') return dateA - dateB;
            if (sortBy === 'price-desc') return amountB - amountA;
            if (sortBy === 'price-asc') return amountA - amountB;
            return 0;
        });

        setFiltered(result);
    }, [orders, search, statusFilter, paymentFilter, sortBy]);

    return (
        <div className="p-6 min-h-screen bg-[#0a0a0a] text-white">
            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white m-0 uppercase">Manage Bookings</h2>
                    <p className="text-gray-400 text-xs mt-1">Process bookings, audit payment receipts, and schedule dispatches</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<FiRefreshCw className={refreshing ? 'animate-spin' : ''} />} 
                    loading={refreshing} 
                    onClick={handleRefresh}
                    className="!bg-gradient-to-r !from-[#D4AF37] !to-[#AA7C11] hover:brightness-110 !text-black border-0 font-bold flex items-center justify-center gap-1.5 h-9"
                >
                    Refresh Orders
                </Button>
            </div>

            {/* Quick Metrics Statistics */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={12} md={6}>
                    <div className="bg-[#121212]/90 border border-neutral-900 p-4 rounded-2xl shadow-lg">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">All Bookings</div>
                        <div className="text-2xl font-extrabold mt-1 text-white">{stats.total}</div>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="bg-[#121212]/90 border border-neutral-900 border-l-4 border-orange-500 p-4 rounded-2xl shadow-lg">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Waiting Payment</div>
                        <div className="text-2xl font-extrabold mt-1 text-orange-400">{stats.waiting}</div>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="bg-[#121212]/90 border border-neutral-900 border-l-4 border-blue-500 p-4 rounded-2xl shadow-lg">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Processing</div>
                        <div className="text-2xl font-extrabold mt-1 text-blue-400">{stats.processing}</div>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="bg-[#121212]/90 border border-neutral-900 border-l-4 border-emerald-500 p-4 rounded-2xl shadow-lg">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Dispatched</div>
                        <div className="text-2xl font-extrabold mt-1 text-emerald-400">{stats.outForDelivery}</div>
                    </div>
                </Col>
            </Row>

            {/* Search & Filters Controls Toolbar */}
            <div className="bg-[#121212]/50 border border-neutral-900 rounded-2xl p-5 mb-6 shadow-md">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    {/* Left: Status Filter Segment */}
                    <div className="w-full lg:w-auto flex items-center overflow-x-auto pb-2 lg:pb-0">
                        <Segmented
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val)}
                            options={[
                                { label: 'All Orders', value: 'All' },
                                { label: 'Waiting Payment', value: 'Waiting for Payment' },
                                { label: 'Processing', value: 'Order Processing' },
                                { label: 'Dispatched', value: 'Out for Delivery' }
                            ]}
                            className="bg-neutral-950 border border-neutral-900 p-1 text-gray-400"
                        />
                    </div>

                    {/* Right: Dropdown Filters & Search */}
                    <div className="w-full lg:w-auto flex flex-wrap items-center justify-end gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">PAYMENT:</span>
                            <Select 
                                value={paymentFilter} 
                                onChange={(val) => setPaymentFilter(val)}
                                className="w-[140px] !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                            >
                                <Option value="All">All Payments</Option>
                                <Option value="Paid">Paid</Option>
                                <Option value="Not Paid">Not Paid</Option>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SORT:</span>
                            <Select 
                                value={sortBy} 
                                onChange={(val) => setSortBy(val)}
                                className="w-[170px] !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                            >
                                <Option value="date-desc">Newest First</Option>
                                <Option value="date-asc">Oldest First</Option>
                                <Option value="price-desc">Value (High-Low)</Option>
                                <Option value="price-asc">Value (Low-High)</Option>
                            </Select>
                        </div>

                        <Input 
                            placeholder="Search client/ID/phone..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[220px] !bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 h-9"
                            allowClear
                        />
                    </div>
                </div>
            </div>

            {/* Active Orders List Display */}
            <div className="flex flex-col gap-5 mb-6" >
                {
                    filtered?.length === 0 ?
                        <div className="w-full text-center py-16 bg-[#121212]/30 border border-neutral-900 rounded-2xl p-6" >
                            <p className="text-gray-400 text-sm font-light m-0">No orders match your filter criteria.</p>
                            <p className="text-gray-500 text-xs font-light m-0 mt-1">Try adjusting the search query or filtering selectors.</p>
                        </div>
                        :
                        <>
                            {
                                filtered?.map((order, index) => {
                                    return (
                                        <Order isAdmin={true} data={order} key={index} />
                                    )
                                })
                            }
                        </>
                }
            </div>
        </div>
    );
}
