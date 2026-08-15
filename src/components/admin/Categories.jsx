import React, { useEffect, useState } from 'react';
import { Table, App } from 'antd';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { useActions } from '../../actions/admin';
import { useAdminStore } from '../../store/adminStore';

const Categories = () => {
    const { addCategory, deleteCategory, editCategory } = useActions()
    const [editId, setEditId] = useState("")
    const { categories } = useAdminStore()
    const { message } = App.useApp()

    let temp = ''    

    const [newCategory, setNewCategory] = useState('')

    useEffect(() => {
        if (editId) {
            const category = categories?.filter((cat) => cat?.id === editId)
            setNewCategory(category[0]?.category)
            temp = category[0]?.category
        }
    }, [editId])

    const columns = [
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Category Name</span>,
            dataIndex: 'category',
            key: 'category',
            render: (text) => <span className="text-white font-semibold text-sm">{text}</span>
        },
        {
            title: <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Actions</span>,
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (record) => (
                <div className="flex items-center gap-4" >
                    <button
                        onClick={() => { setEditId(record) }}
                        className="cursor-pointer bg-transparent border-0 text-amber-400 hover:text-amber-300 transition text-sm p-1"
                        title="Edit Category"
                    >
                        <FiEdit />
                    </button>
                    <button
                        onClick={() => { deleteCategory(record) }}
                        className="cursor-pointer bg-transparent border-0 text-red-400 hover:text-red-300 transition text-sm p-1"
                        title="Delete Category"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            ),
        },
    ];

    const handleAdd = () => {
        if (!newCategory?.trim())
            return
        const isExist = categories?.filter((catg) => catg?.category === newCategory?.trim())
        if (isExist?.length) {
            message.error("Category already exists.")
            return;
        }
        addCategory(newCategory?.trim(), message)
        setNewCategory("")
    }

    const handleEdit = () => {
        if (!newCategory?.trim())
            return
        const isExist = categories?.filter((catg) => catg?.category === newCategory?.trim())
        if (isExist?.length) {
            message.error("Category already exists.")
            return;
        }
        editCategory(editId, newCategory)
        setEditId('')
        setNewCategory("")
        temp = ""
    }

    return (
        <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-4 uppercase">Manage Categories</h2>

            {/* Add Category Form */}
            <div className="bg-[#121212]/50 border border-neutral-900 px-5 py-5 rounded-2xl flex flex-col gap-4 shadow-md" >
                <input 
                    placeholder="Enter Category Name" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (editId) handleEdit()
                            else handleAdd()
                        }
                    }}
                    className="w-full bg-neutral-950 border border-neutral-850 focus:border-[#D4AF37] focus:outline-none text-white h-11 px-4 rounded-lg text-sm transition"
                />
                
                <div className="flex justify-end gap-3" >
                    {
                        editId ?
                        <>
                            <button 
                                onClick={handleEdit}
                                className="h-10 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-6 rounded-lg transition text-xs uppercase tracking-wider"
                            >
                                Update
                            </button>
                            <button 
                                onClick={() => {
                                    setNewCategory('')
                                    setEditId('')
                                    temp = ''
                                }} 
                                className="h-10 cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-red-500 text-white font-extrabold px-6 rounded-lg transition text-xs uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                        </> :
                        <button 
                            onClick={handleAdd}
                            className="h-10 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-6 rounded-lg transition text-xs uppercase tracking-wider"
                        >
                            Add Category
                        </button>
                    }
                </div>
            </div>

            {/* Categories Table */}
            <div className="mt-6 border border-neutral-900 rounded-2xl overflow-hidden bg-[#121212]/30 shadow-md">
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    className="w-full text-white"
                />
            </div>
        </div>
    );
};

export default Categories;
