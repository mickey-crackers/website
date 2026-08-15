import { Badge, Button, Drawer, Modal, Popconfirm, Select } from 'antd'
import React, { useState } from 'react'
import { useActions } from '../actions/admin'
import { downloadInvoice } from '../utils/invoiceHelper';
import { getAdminSendIdUrl } from '../utils/whatsappHelper';
import { MdDelete, MdEdit, MdLocalPhone, MdOutlineAccessTime, MdOutlineShoppingCart, MdOutlineWhatsapp, MdOutlineFileDownload } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

export default function Order({ data, isAdmin }) {

    const [openDrawer, setOpenDrawer] = useState(false)
    const [openEditStatus, setOpenEditStatus] = useState(false);
    const { updateOrderStatus, deleteOrder } = useActions()

    // Edit
    const [values, setValues] = useState({ paymentStatus: '', orderStatus: '' })

    const OrderStatus = ['Waiting for Payment', 'Order Processing', 'Out for Delivery']
    const PaymentStatus = ['Not Paid', 'Paid']

    async function updateStatus() {
        if (values?.orderStatus != data?.orderStatus || values?.paymentStatus != data?.paymentStatus) {
            await updateOrderStatus(data?.id, values)
        }
        setValues({ paymentStatus: '', orderStatus: '' })
        setOpenEditStatus(false)
    }

    const message = `Hello ${data?.customerData?.fullName}\n\nTrack Your order here\nhttps://mickeycrackers.com/track-order?id=${data?.orderID}\n\nThank you for choosing us`;
    
    return (
        <div className="p-5 rounded-2xl border bg-[#121212]/50 border-neutral-900 hover:border-[#D4AF37]/30 transition-all duration-300 relative shadow-lg" >
            <div className="flex justify-between items-center mb-4" >
                <div>
                    <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider m-0" >Order ID</p>
                    <p className="font-bold text-[#D4AF37] font-mono text-sm sm:text-base m-0 mt-0.5" >{data?.orderID}</p>
                </div>
                <div className="me-2 cursor-pointer" onClick={() => {
                    setOpenDrawer(true)
                }}>
                    <Badge count={data?.cart?.totalQuantity} showZero={false} >
                        <div className="w-10 h-10 flex justify-center items-center bg-neutral-950 border border-neutral-850 rounded-xl hover:border-[#D4AF37]/40 transition duration-300" >
                            <MdOutlineShoppingCart className="text-lg text-amber-100" />
                        </div>
                    </Badge>
                </div>
            </div>

            <div className="my-2 space-y-2" >
                <p className="font-bold text-white text-base tracking-wide m-0" >{data?.customerData?.fullName}</p>
                <p className="text-xs text-gray-400 font-light leading-relaxed m-0" >
                    {data?.customerData?.address}, {data?.customerData?.city}, {data?.customerData?.state} - {data?.customerData?.pincode}.
                </p>
                
                {
                    isAdmin && (
                        <div className="space-y-1.5 pt-1 border-t border-neutral-900/60 mt-2">
                            <div className="flex items-center gap-2" >
                                <MdOutlineMailOutline className="text-[#D4AF37]/70 text-sm" />
                                <a className="text-xs text-gray-300 hover:text-[#D4AF37] transition font-light" href={`mailto:${data?.customerData?.email}`} target="_blank" rel="noreferrer" >
                                    {data?.customerData?.email}
                                </a>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5" >
                                <div className="flex items-center gap-2" >
                                    <MdLocalPhone className="text-[#D4AF37]/70 text-sm" />
                                    <a className="text-xs text-gray-300 hover:text-[#D4AF37] transition font-light" href={`tel:${data?.customerData?.phone}`} target="_blank" rel="noreferrer" >
                                        {data?.customerData?.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2" >
                                    <MdOutlineWhatsapp className="text-[#D4AF37]/70 text-sm" />
                                    <a className="text-xs text-gray-300 hover:text-[#D4AF37] transition font-light" href={`https://wa.me/${data?.customerData?.phone}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" >
                                        {data?.customerData?.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2" >
                    <div className="flex items-center gap-1.5" >
                        <TbTruckDelivery className="text-[#D4AF37]/80 text-sm" />
                        <span className="text-[11px] text-gray-300 font-light">{data?.orderStatus}</span>
                    </div>
                    <div className="flex items-center gap-1.5" >
                        <MdPayments className="text-[#D4AF37]/80 text-sm" />
                        <span className="text-[11px] text-gray-300 font-light">{data?.paymentStatus}</span>
                    </div>
                    <div className="flex items-center gap-1.5" >
                        <MdOutlineAccessTime className="text-[#D4AF37]/80 text-sm" />
                        <span className="text-[11px] text-gray-300 font-light">{nowToReadableDate(data?.orderedAt)}</span>
                    </div>
                </div>
            </div>

            {
                isAdmin ? (
                    <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-neutral-900/60 pt-3" >
                        <Button 
                            type="default" 
                            className="!bg-emerald-600 hover:!bg-emerald-500 !text-white border-0 flex items-center justify-center font-bold text-xs h-8 rounded-lg"
                            icon={<MdOutlineWhatsapp />} 
                            onClick={() => window.open(getAdminSendIdUrl(data), '_blank')}
                        >
                            Send Order ID
                        </Button>
                        <Button 
                            type="default" 
                            icon={<MdOutlineFileDownload />} 
                            onClick={() => downloadInvoice(data)}
                            className="!bg-neutral-900 !border-neutral-850 hover:!border-[#D4AF37] hover:!text-[#D4AF37] !text-white flex items-center justify-center h-8 rounded-lg"
                        />
                        <Button 
                            type="default" 
                            icon={<MdEdit />} 
                            onClick={() => {
                                setValues({ paymentStatus: data?.paymentStatus, orderStatus: data?.orderStatus })
                                setOpenEditStatus(true)
                            }} 
                            className="!bg-neutral-900 !border-neutral-850 hover:!border-[#D4AF37] hover:!text-[#D4AF37] !text-white flex items-center justify-center h-8 rounded-lg"
                        />
                        <Popconfirm
                            title="Delete Order"
                            description="Are you sure you want to delete this order?"
                            onConfirm={() => {
                                deleteOrder(data?.id)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger icon={<MdDelete />} className="flex items-center justify-center h-8 rounded-lg" />
                        </Popconfirm>
                    </div>
                ) : (
                    data?.paymentStatus === 'Paid' && (
                        <div className="absolute right-4 bottom-4" >
                            <Button 
                                type="primary" 
                                size="small" 
                                icon={<MdOutlineFileDownload />} 
                                onClick={() => downloadInvoice(data)}
                                className="!bg-gradient-to-r !from-[#D4AF37] !to-[#AA7C11] !text-black border-0 hover:brightness-110 font-bold rounded-lg h-7"
                            >
                                Invoice
                            </Button>
                        </div>
                    )
                )
            }

            <Drawer 
                open={openDrawer} 
                title={<span className="text-white font-bold tracking-wide">Order details #{data?.orderID}</span>}
                onClose={() => {
                    setOpenDrawer(false)
                }} 
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
            >
                <h4 className="text-xs font-bold text-amber-100 uppercase tracking-wider mb-4">Order Summary</h4>
                <div className="flex flex-col gap-3 mb-6" >
                    {
                        data?.cart?.products?.map((product, index) => {
                            return (
                                <div className="w-full py-3 px-4 border bg-[#121212]/30 border-neutral-900 rounded-xl" key={index} >
                                    <div className="flex justify-between items-center" >
                                        <p className="font-semibold text-white text-xs m-0" >{product?.name}</p>
                                        <p className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-neutral-950 text-[#D4AF37] border border-neutral-850 m-0" >
                                            {product?.quantityType || product?.type}
                                        </p>
                                    </div>
                                    <div className="text-[11px] text-gray-400 mt-1" >
                                        {product?.count || product?.qty} x ₹{product?.price} = <span className="text-amber-100 font-bold ml-1">₹{product?.total}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                
                <div className="flex flex-col gap-2 pt-4 border-t border-neutral-900/80 text-xs font-light text-gray-300" >
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Sub Total</span>
                        <span className="font-semibold text-white">₹{data?.cart?.subTotal}</span>
                    </div>
                    {data?.cart?.couponCode && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Coupon Discount ({data?.cart?.couponCode})</span>
                            <span className="font-semibold text-green-400">
                                {data?.cart?.packingDiscount ? 'Free Packing' : `- ₹${data?.cart?.couponDiscount || 0}`}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Packing Fee</span>
                        <span className="font-semibold text-white">
                            {data?.cart?.packingDiscount ? '₹0 (Free)' : `₹${data?.cart?.totalAmount - data?.cart?.subTotal + (data?.cart?.couponDiscount || 0)}`}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-900 font-bold text-sm text-white mt-1">
                        <span>Total Paid / Payable</span>
                        <span className="text-[#D4AF37] font-extrabold text-base">₹{data?.cart?.totalAmount}</span>
                    </div>

                    {(isAdmin || data?.paymentStatus === 'Paid') && (
                        <button 
                            onClick={() => downloadInvoice(data)}
                            className="mt-6 w-full h-10 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-4 rounded-lg shadow-md transition text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                            <MdOutlineFileDownload className="text-sm" /> Download Invoice PDF
                        </button>
                    )}
                </div>
            </Drawer>

            <Modal 
                title={<span className="text-white font-bold tracking-wide">Edit Order status</span>}
                open={openEditStatus} 
                okText="Update" 
                onCancel={() => {
                    setValues({ paymentStatus: '', orderStatus: '' })
                    setOpenEditStatus(false)
                }} 
                onOk={() => {
                    updateStatus()
                }} 
                styles={{
                    content: {
                        backgroundColor: '#121212',
                        border: '1px solid #262626',
                        borderRadius: '24px',
                        color: '#ffffff'
                    }
                }}
            >
                <div className="w-full my-4 " >
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1" >Order Status</p>
                    <Select 
                        className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]" 
                        size="large" 
                        value={values?.orderStatus} 
                        options={OrderStatus?.map((option) => { return { label: option, value: option } })} 
                        onChange={(value) => {
                            setValues({ ...values, orderStatus: value })
                        }} 
                    />
                </div>
                <div className="w-full my-4 " >
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1" >Payment Status</p>
                    <Select 
                        className="w-full !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]" 
                        size="large" 
                        value={values?.paymentStatus} 
                        options={PaymentStatus?.map((option) => { return { label: option, value: option } })} 
                        onChange={(value) => {
                            setValues({ ...values, paymentStatus: value })
                        }} 
                    />
                </div>
            </Modal>
        </div>
    )
}

function nowToReadableDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}
