import React, { useState } from 'react';
import { Table, Popconfirm, App, Image, Drawer } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAdminStore } from '../../store/adminStore';
import Logo from '../../assets/mickey-logo.png'
import { useActions } from '../../actions/admin'
import AddOrEditProduct from '../../components/AddOrEditProduct';

const ManageProducts = () => {
    const { products, setCurrentProduct } = useAdminStore()
    const [isEdit, setIsEdit] = useState(false);

    const { deleteProduct } = useActions()
    const { message } = App.useApp()

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id)
        } catch (err) {
            message.error('Delete failed: ' + err.message);
        }
    };

    const handleClose = () => {
        setIsEdit(false)
        setCurrentProduct(null)
    }

    // Columns for AntD table
    const columns = [
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Sno</span>,
            key: 'index',
            width: 80,
            render: (text, record, index) => <span className="text-gray-400 font-mono text-xs">{index + 1}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Image</span>,
            dataIndex: 'imageFile',
            key: 'imageFile',
            width: 90,
            render: (url) => (
                <Image
                    width={44}
                    height={44}
                    src={url || Logo.src || Logo}
                    fallback={Logo.src || Logo}
                    alt="Product"
                    className="object-cover rounded-lg border border-neutral-900 bg-neutral-950 p-0.5"
                />
            ),
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Product Name</span>,
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="text-white font-semibold text-xs tracking-wide">{text}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Quantity</span>,
            dataIndex: 'quantityType',
            key: 'quantityType',
            render: (text) => <span className="text-gray-300 text-xs font-light">{text}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Category</span>,
            dataIndex: 'category',
            key: 'category',
            render: (text) => <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">{text}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Price (₹)</span>,
            dataIndex: 'price',
            key: 'price',
            render: (price) => <span className="text-amber-100 font-bold text-xs">₹{price.toLocaleString('en-IN')}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Actions</span>,
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setCurrentProduct(record)
                            setIsEdit(true)
                        }}
                        className="cursor-pointer bg-transparent border-0 text-amber-400 hover:text-amber-300 transition text-sm p-1"
                        title="Edit Product"
                    >
                        <FiEdit2 />
                    </button>
                    <Popconfirm
                        title="Delete Product"
                        description="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        placement="leftTop"
                    >
                        <button
                            className="cursor-pointer bg-transparent border-0 text-red-400 hover:text-red-300 transition text-sm p-1"
                            title="Delete Product"
                        >
                            <FiTrash2 />
                        </button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6 uppercase">Manage Products</h2>
            
            <div className="border border-neutral-900 rounded-2xl overflow-hidden bg-[#121212]/30 shadow-md">
                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey={(record) => record.id || record.index}
                    pagination={{ pageSize: 10 }}
                    className="w-full text-white"
                />
            </div>
            
            <Drawer 
                open={isEdit} 
                size="large" 
                onClose={handleClose} 
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
                title={<span className="text-white font-bold tracking-wide">Edit Product Details</span>}
            >
                <AddOrEditProduct isEdit={isEdit} setOpen={setIsEdit} />
            </Drawer>
        </div>
    );
};

export default ManageProducts;
