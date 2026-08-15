"use client";
import React, { useEffect, useState } from 'react';
import { Card, InputNumber, Button, App, Divider, Form } from 'antd';
import { FiPercent, FiPackage, FiShoppingBag, FiSave, FiInfo } from 'react-icons/fi';
import { useActions } from '../../actions/admin';
import { useAdminStore } from '../../store/adminStore/index';

const SettingsPage = () => {
    const [data, setData] = useState({});
    const { settings } = useAdminStore();
    const { updateSettings } = useActions();
    const { message } = App.useApp();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setData(settings);
        }
    }, [settings]);

    const handleSave = async () => {
        if (data?.discount === undefined || data?.minimumAmount === undefined || data?.courierCharge === undefined) {
            message.error("Please fill in all setting fields.");
            return;
        }
        setSaving(true);
        try {
            await updateSettings(data);
            setTimeout(() => {
                setSaving(false);
            }, 800);
        } catch (error) {
            setSaving(false);
            message.error("Failed to update settings.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-8 flex flex-col bg-[#0a0a0a] min-h-screen text-white gap-8">
            
            {/* Global Store Settings Card */}
            <Card 
                className="!bg-[#121212]/50 border border-neutral-900 shadow-xl rounded-2xl overflow-hidden"
                title={
                    <div className="py-2">
                        <h2 className="text-2xl font-bold tracking-tight text-white m-0 uppercase">Global Store Settings</h2>
                        <p className="text-gray-400 text-xs mt-1">Configure discounts, packing logistics fee, and booking order thresholds</p>
                    </div>
                }
            >
                <Form layout="vertical">
                    
                    {/* Discount Settings Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FiPercent className="text-[#D4AF37] text-base" />
                            <span className="font-semibold text-white text-sm">Store-wide Discount (%)</span>
                        </div>
                        <span className="text-xs text-gray-400 block mb-2 font-light">
                            The flat wholesale discount percentage subtracted automatically from listing catalog rates for all items.
                        </span>
                        <Form.Item required className="!mb-2">
                            <InputNumber
                                min={0}
                                max={100}
                                value={data?.discount}
                                onChange={(value) => setData({ ...data, discount: value })}
                                className="w-full sm:w-[220px] !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37] rounded-lg h-10"
                                placeholder="e.g. 10"
                                formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                                size="large"
                            />
                        </Form.Item>
                    </div>
 
                    <Divider className="!border-neutral-900/60 my-4" />
 
                    {/* Courier Packing Sack Charge Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FiPackage className="text-[#D4AF37] text-base" />
                            <span className="font-semibold text-white text-sm">Secured Packing Charge (₹)</span>
                        </div>
                        <span className="text-xs text-gray-400 block mb-2 font-light">
                            Sack/carton packing logistics fee added to each order. (Can be waived using 'Free Packing' coupons).
                        </span>
                        <Form.Item required className="!mb-2">
                            <InputNumber
                                min={0}
                                value={data?.courierCharge}
                                onChange={(value) => setData({ ...data, courierCharge: value })}
                                className="w-full sm:w-[220px] !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37] rounded-lg h-10"
                                placeholder="e.g. 150"
                                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                                size="large"
                            />
                        </Form.Item>
                    </div>
 
                    <Divider className="!border-neutral-900/60 my-4" />
 
                    {/* Minimum Order Value Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FiShoppingBag className="text-[#D4AF37] text-base" />
                            <span className="font-semibold text-white text-sm">Minimum Order Amount Requirement (₹)</span>
                        </div>
                        <span className="text-xs text-gray-400 block mb-2 font-light">
                            The minimum subtotal value required for a customer to complete a checkout booking request.
                        </span>
                        <Form.Item required className="!mb-2">
                            <InputNumber
                                min={0}
                                value={data?.minimumAmount}
                                onChange={(value) => setData({ ...data, minimumAmount: value })}
                                className="w-full sm:w-[220px] !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37] rounded-lg h-10"
                                placeholder="e.g. 3000"
                                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                                size="large"
                            />
                        </Form.Item>
                    </div>
 
                    <Divider className="!border-neutral-900/60 my-6" />
 
                    {/* Info Alert Box */}
                    <div className="bg-amber-950/20 border border-[#D4AF37]/20 rounded-xl p-4 flex gap-3 items-start mb-6">
                        <FiInfo className="text-[#D4AF37] text-base mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-amber-100/70 leading-relaxed font-light">
                            <strong>Note:</strong> Updating these options directly changes calculations in real-time for customer checkouts, cart summaries, and backend order validations. Make changes carefully.
                        </div>
                    </div>
 
                    <Button 
                        type="primary" 
                        icon={<FiSave />} 
                        onClick={handleSave} 
                        size="large"
                        loading={saving}
                        block
                        className="!bg-gradient-to-r !from-[#D4AF37] !to-[#AA7C11] hover:brightness-110 !text-black border-0 font-extrabold h-11 rounded-lg uppercase tracking-wider text-xs flex items-center justify-center gap-1.5"
                    >
                        Save Configurations
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default SettingsPage;
