"use client";
import React, { useEffect, useState } from 'react';
import { Card, Input, Button, App, Select, Table, Tag, Popconfirm } from 'antd';
import { FiKey, FiUser, FiTrash2, FiPlus, FiLock } from 'react-icons/fi';
import { useActions } from '../../actions/admin';
import { useAdminStore } from '../../store/adminStore/index';

const { Option } = Select;

export default function PasscodeManager() {
    const { passcodes } = useAdminStore();
    const { getAllPasscodes, addPasscode, deletePasscode } = useActions();
    const { message } = App.useApp();

    const [newPasscode, setNewPasscode] = useState({ passcode: '', name: '', role: 'Salesman' });
    const [addingUser, setAddingUser] = useState(false);

    useEffect(() => {
        getAllPasscodes();
    }, []);

    const handleAddPasscode = async () => {
        if (!newPasscode.name.trim() || !newPasscode.passcode.trim()) {
            message.error("Please enter both staff name and passcode.");
            return;
        }
        setAddingUser(true);
        try {
            await addPasscode(newPasscode);
            setNewPasscode({ passcode: '', name: '', role: 'Salesman' });
        } catch (error) {
            message.error("Error creating passcode.");
        } finally {
            setAddingUser(false);
        }
    };

    // Columns for Passcodes List Table
    const passcodeColumns = [
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Staff / Device Name</span>,
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-semibold text-white text-xs">{text}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Access Passcode</span>,
            dataIndex: 'passcode',
            key: 'passcode',
            render: (code) => <code className="bg-neutral-950 border border-neutral-850 px-2 py-1 rounded text-[#D4AF37] font-bold font-mono tracking-wider text-xs">{code}</code>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Role / Access Scope</span>,
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'Admin' ? 'indigo' : 'orange'} className="font-bold text-[10px] uppercase tracking-wider">
                    {role === 'Admin' ? 'Administrator' : 'Sales Representative'}
                </Tag>
            )
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Action</span>,
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title="Revoke Access"
                    description={`This passcode will immediately be disabled and ${record.name} will be logged out.`}
                    onConfirm={() => deletePasscode(record.id)}
                    okText="Yes"
                    cancelText="No"
                    placement="leftTop"
                >
                    <button
                        className="cursor-pointer bg-transparent border-0 text-red-400 hover:text-red-300 transition text-sm p-1"
                        title="Revoke access"
                    >
                        <FiTrash2 />
                    </button>
                </Popconfirm>
            )
        }
    ];

    return (
        <div className="mx-auto p-4 sm:p-8 flex flex-col bg-[#0a0a0a] min-h-screen text-white gap-6">
            <div className="mb-2">
                <h2 className="text-2xl font-bold tracking-tight text-white m-0 uppercase">Passcode Management</h2>
                <p className="text-gray-400 text-xs mt-1">Create and revoke login passcodes for Administrators and Sales representatives</p>
            </div>

            <Card
                className="!bg-[#121212]/50 border border-neutral-900 shadow-xl rounded-2xl overflow-hidden"
                title={
                    <div className="py-1 flex items-center gap-2">
                        <FiLock className="text-[#D4AF37] text-lg" />
                        <span className="font-bold text-white uppercase tracking-wider text-xs">Configure Staff Access</span>
                    </div>
                }
            >
                {/* Form to Add Passcode */}
                <div className="bg-[#121212]/85 border border-neutral-900 p-5 rounded-2xl mb-6">
                    <span className="font-bold text-amber-100 text-xs uppercase tracking-wider block mb-3">Add New Access Credentials</span>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-grow w-full">
                            <span className="text-[10px] text-gray-500 block mb-1.5 uppercase font-bold tracking-wider">Staff / Device Name</span>
                            <Input
                                prefix={<FiUser className="text-gray-400 mr-1" />}
                                placeholder="e.g. Sales Desk A"
                                value={newPasscode.name}
                                onChange={(e) => setNewPasscode({ ...newPasscode, name: e.target.value })}
                                className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-10"
                            />
                        </div>
                        <div className="w-full sm:w-[160px]">
                            <span className="text-[10px] text-gray-500 block mb-1.5 uppercase font-bold tracking-wider">Passcode</span>
                            <Input
                                prefix={<FiKey className="text-gray-400 mr-1" />}
                                placeholder="e.g. 7890"
                                value={newPasscode.passcode}
                                onChange={(e) => setNewPasscode({ ...newPasscode, passcode: e.target.value })}
                                className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-10"
                                maxLength={12}
                            />
                        </div>
                        <div className="w-full sm:w-[160px]">
                            <span className="text-[10px] text-gray-500 block mb-1.5 uppercase font-bold tracking-wider">Access Role</span>
                            <Select
                                value={newPasscode.role}
                                onChange={(val) => setNewPasscode({ ...newPasscode, role: val })}
                                className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37] rounded-lg h-10"
                            >
                                <Option value="Admin">Admin</Option>
                                <Option value="Salesman">Salesman</Option>
                            </Select>
                        </div>
                        <button
                            onClick={handleAddPasscode}
                            disabled={addingUser}
                            className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold h-10 px-6 w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg shadow-md transition uppercase tracking-wider text-xs"
                        >
                            <FiPlus className="text-sm" /> Create
                        </button>
                    </div>
                </div>

                {/* Table of Passcodes */}
                <div className="border border-neutral-900 bg-neutral-950/30 rounded-xl overflow-hidden">
                    <Table
                        dataSource={passcodes}
                        columns={passcodeColumns}
                        rowKey="id"
                        pagination={false}
                        className="w-full text-white"
                        locale={{ emptyText: <span className="text-gray-500 text-xs font-light py-6 block">No passcodes generated yet. Create one above!</span> }}
                    />
                </div>
            </Card>
        </div>
    );
}
