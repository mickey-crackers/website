"use client";
import React, { useEffect, useState } from 'react';
import { Table, Button, Input, InputNumber, Select, Switch, Popconfirm, Drawer, DatePicker, App, Tag } from 'antd';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useActions } from '../../actions/admin';
import { useAdminStore } from '../../store/adminStore';
import dayjs from 'dayjs';

const { Option } = Select;

export default function CouponManagement() {
    const { addCoupon, getAllCoupons, deleteCoupon, toggleCouponStatus } = useActions();
    const { coupons, categories } = useAdminStore();
    const { message } = App.useApp();

    const [openDrawer, setOpenDrawer] = useState(false);
    const [formValues, setFormValues] = useState({
        code: '',
        type: 'percentage',
        value: 0,
        minOrderValue: 0,
        startDate: null,
        endDate: null,
        maxClaims: 100,
        excludedCategories: []
    });

    useEffect(() => {
        getAllCoupons();
    }, []);

    const handleCreate = () => {
        const { code, type, value, minOrderValue, startDate, endDate, maxClaims, excludedCategories } = formValues;

        if (!code.trim()) {
            message.error("Please enter a coupon code");
            return;
        }

        if (type !== 'free_packing' && (!value || value <= 0)) {
            message.error("Please enter a valid discount value");
            return;
        }

        if (!startDate || !endDate) {
            message.error("Please select validity dates");
            return;
        }

        const data = {
            code: code.trim().toUpperCase(),
            type,
            value: type === 'free_packing' ? 0 : Number(value),
            minOrderValue: Number(minOrderValue || 0),
            startDate: startDate.valueOf(),
            endDate: endDate.valueOf(),
            maxClaims: Number(maxClaims || 99999),
            excludedCategories: excludedCategories || []
        };

        addCoupon(data);
        setOpenDrawer(false);
        setFormValues({
            code: '',
            type: 'percentage',
            value: 0,
            minOrderValue: 0,
            startDate: null,
            endDate: null,
            maxClaims: 100,
            excludedCategories: []
        });
    };

    const columns = [
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Coupon Code</span>,
            dataIndex: 'code',
            key: 'code',
            render: (code) => <span className="font-bold text-[#D4AF37] font-mono text-xs">{code}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Type</span>,
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                let color = 'blue';
                let label = 'Percentage';
                if (type === 'flat') { color = 'purple'; label = 'Flat Amount'; }
                if (type === 'free_packing') { color = 'green'; label = 'Free Packing'; }
                return <Tag color={color} className="text-[10px] font-bold uppercase tracking-wider">{label}</Tag>;
            }
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Discount Value</span>,
            dataIndex: 'value',
            key: 'value',
            render: (value, record) => {
                if (record.type === 'free_packing') return <span className="text-gray-400 text-xs">N/A</span>;
                return <span className="text-white text-xs font-semibold">{record.type === 'percentage' ? `${value}%` : `₹${value.toLocaleString('en-IN')}`}</span>;
            }
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Min Order</span>,
            dataIndex: 'minOrderValue',
            key: 'minOrderValue',
            render: (val) => <span className="text-amber-100 font-semibold text-xs">₹{(val || 0).toLocaleString('en-IN')}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Claims Status</span>,
            key: 'claims',
            render: (_, record) => <span className="text-gray-300 text-xs font-light">{record.claimedCount || 0} / {record.maxClaims === 99999 ? 'Unlimited' : record.maxClaims}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Validity</span>,
            key: 'validity',
            render: (_, record) => {
                const start = dayjs(record.startDate).format('DD MMM YY');
                const end = dayjs(record.endDate).format('DD MMM YY');
                return <span className="text-gray-300 text-xs font-light">{start} - {end}</span>;
            }
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Active</span>,
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={(checked) => toggleCouponStatus(record.id, checked)}
                />
            )
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Actions</span>,
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title="Delete Coupon"
                    description="Are you sure you want to delete this coupon?"
                    onConfirm={() => deleteCoupon(record.id)}
                    okText="Yes"
                    cancelText="No"
                    placement="leftTop"
                >
                    <button
                        className="cursor-pointer bg-transparent border-0 text-red-400 hover:text-red-300 transition text-sm p-1"
                        title="Delete Coupon"
                    >
                        <FiTrash2 />
                    </button>
                </Popconfirm>
            )
        }
    ];

    return (
        <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white m-0 uppercase">Manage Coupons</h2>
                    <p className="text-gray-400 text-xs mt-1">Configure user promotion discounts and free secured packaging coupons</p>
                </div>
                <Button
                    type="primary"
                    icon={<FiPlus />}
                    onClick={() => setOpenDrawer(true)}
                    className="!bg-gradient-to-r !from-[#D4AF37] !to-[#AA7C11] hover:brightness-110 !text-black border-0 font-bold flex items-center justify-center gap-1.5 h-9"
                >
                    Create Coupon
                </Button>
            </div>

            <div className="border border-neutral-900 rounded-2xl overflow-hidden bg-[#121212]/30 shadow-md">
                <Table
                    dataSource={coupons}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="w-full text-white"
                />
            </div>

            <Drawer
                title={<span className="text-white font-bold tracking-wide">Create New Coupon</span>}
                width={500}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                styles={{
                    content: {
                        backgroundColor: '#0a0a0a',
                        color: '#ffffff',
                        borderLeft: '1px solid #1c1c1c'
                    },
                    header: {
                        backgroundColor: '#121212',
                        borderBottom: '1px solid #1c1c1c',
                        padding: '16px 24px'
                    }
                }}
                footer={
                    <div className="flex justify-end gap-3 p-4 bg-[#121212] border-t border-neutral-900">
                        <button 
                            onClick={() => setOpenDrawer(false)}
                            className="h-9 cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white text-xs font-semibold px-4 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleCreate}
                            className="h-9 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-5 rounded-lg shadow-md transition text-xs uppercase"
                        >
                            Save Coupon
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Coupon Code *</label>
                        <Input
                            placeholder="e.g. FESTIVE10"
                            value={formValues.code}
                            onChange={(e) => setFormValues({ ...formValues, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
                            className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-10"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Discount Type *</label>
                        <Select
                            className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                            value={formValues.type}
                            onChange={(val) => setFormValues({ ...formValues, type: val })}
                        >
                            <Option value="percentage">Percentage Discount (%)</Option>
                            <Option value="flat">Flat Amount Discount (₹)</Option>
                            <Option value="free_packing">Free Secured Packing (Waive Sack Charge)</Option>
                        </Select>
                    </div>

                    {formValues.type !== 'free_packing' && (
                        <div>
                            <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Discount Value *</label>
                            <InputNumber
                                className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                                min={1}
                                max={formValues.type === 'percentage' ? 100 : 100000}
                                value={formValues.value}
                                onChange={(val) => setFormValues({ ...formValues, value: val })}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Minimum Order Value (₹)</label>
                        <InputNumber
                            className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                            min={0}
                            value={formValues.minOrderValue}
                            onChange={(val) => setFormValues({ ...formValues, minOrderValue: val })}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Start Date *</label>
                            <DatePicker
                                className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                                value={formValues.startDate}
                                onChange={(date) => setFormValues({ ...formValues, startDate: date })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">End Date *</label>
                            <DatePicker
                                className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                                value={formValues.endDate}
                                onChange={(date) => setFormValues({ ...formValues, endDate: date })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Max Claims Limit (Total)</label>
                        <InputNumber
                            className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                            min={1}
                            value={formValues.maxClaims}
                            onChange={(val) => setFormValues({ ...formValues, maxClaims: val })}
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Exclude Categories</label>
                        <Select
                            mode="multiple"
                            className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                            placeholder="Select categories to exclude from discount"
                            value={formValues.excludedCategories}
                            onChange={(vals) => setFormValues({ ...formValues, excludedCategories: vals })}
                        >
                            {categories.map((cat, index) => (
                                <Option value={cat.category} key={index}>{cat.category}</Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
