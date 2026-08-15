import React, { useEffect, useState } from 'react';
import { Input, Select, Button, Upload, App, InputNumber, Image, Radio } from 'antd';
import { FiUpload } from 'react-icons/fi';
import { useAdminStore } from '../store/adminStore';
import { useActions } from '../actions/admin'

const { Option } = Select;

const AddOrEditProduct = ({ isEdit, setOpen }) => {

    const { addProduct,editProduct } = useActions()
    const { categories, currentProduct,setCurrentProduct } = useAdminStore()

    const [product, setProduct] = useState({
        name: '',
        quantityType: '',
        category: '',
        price: 0,
        imageFile: ''
    })

    const [imageSource, setImageSource] = useState('upload'); // 'upload' or 'url'

    useEffect(() => {
        if (isEdit && currentProduct) {
            setProduct({ ...currentProduct })
            if (currentProduct.imageFile && (currentProduct.imageFile.startsWith('http://') || currentProduct.imageFile.startsWith('https://') || !currentProduct.imageFile.startsWith('data:'))) {
                setImageSource('url')
            } else {
                setImageSource('upload')
            }
        }
    }, [currentProduct, isEdit])

    const { message } = App.useApp()

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleImageChange = async ({ file }) => {
        const isImage = file.type.startsWith('image/');
        const isLt2MB = file.size / 1024 / 1024 < 1;

        if (!isImage) {
            message.error('You can only upload image files!');
            return Upload.LIST_IGNORE;
        }

        if (!isLt2MB) {
            message.error('Image must be smaller than 1MB!');
            return Upload.LIST_IGNORE;
        }
        try {
            const base64 = await getBase64(file);
            setProduct({ ...product, imageFile: base64 })
        } catch (err) {
            message.error('Failed to read file as Base64');
        }
        return false; // Prevent auto upload
    };

    const handleSubmit = () => {
        if (!product?.name?.trim() || !product?.quantityType?.trim() || !product?.category?.trim() || !product?.price) {
            message.error('Please fill in all fields');
            return;
        }
        addProduct(product)
        setProduct({ name: '', quantityType: '', category: '', price: 0, imageFile: '' })
    };

    const handleEdit = async() => {
        if (!product?.name?.trim() || !product?.quantityType?.trim() || !product?.category?.trim() || !product?.price) {
            message.error('Please fill in all fields');
            return;
        }
        await editProduct(product?.id,product)
        setCurrentProduct(null)
        setOpen(false)
        setProduct({ name: '', quantityType: '', category: '', price: 0, imageFile: '' })
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-[#121212]/50 border border-neutral-900 rounded-2xl shadow-xl my-6 text-white">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6 uppercase">{isEdit ? "Edit Product" : "Create New Product"}</h2>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4" >
                <div>
                    {/* Product Name */}
                    <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Product Name *</label>
                    <Input
                        placeholder="Enter product name"
                        value={product?.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-10 mb-2"
                    />
                </div>

                {/* Quantity Type */}
                <div>
                    <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Quantity Type *</label>
                    <Select
                        placeholder="Select quantity"
                        value={product?.quantityType}
                        onChange={(value) => { setProduct({ ...product, quantityType: value }) }}
                        className="w-full mb-2 !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                    >
                        <Option value="1 Pkt">1 Pkt</Option>
                        <Option value="1 Pcs">1 Pcs</Option>
                        <Option value="1 Box">1 Box</Option>
                        <Option value="1 Tin">1 Tin</Option>
                    </Select>
                </div>

                <div>
                    {/* Category Select */}
                    <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Category *</label>
                    <Select
                        placeholder="Select category"
                        value={product?.category}
                        onChange={(value) => { setProduct({ ...product, category: value }) }}
                        className="w-full mb-2 !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                    >
                        {
                            categories?.map((cat, index) => {
                                return (
                                    <Option value={cat?.category} key={index} >{cat?.category}</Option>
                                )
                            })
                        }
                    </Select>
                </div>

                <div className="w-[100%]" >
                    {/* Price */}
                    <label className="block mb-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Price (₹) *</label>
                    <InputNumber
                        value={product.price}
                        onChange={(value) => { setProduct({ ...product, price: Number(value) }) }}
                        min={0}
                        type="number"
                        className="w-full mb-2 !bg-neutral-950 !border-neutral-850 !text-white focus:!border-[#D4AF37]"
                        style={{ width: "100%" }}
                        placeholder="Enter product price"
                    />
                </div>

                <div className="flex flex-col gap-2 col-span-1 lg:col-span-2" >
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider">Product Image</label>
                    <Radio.Group 
                        value={imageSource} 
                        onChange={(e) => {
                            setImageSource(e.target.value);
                        }}
                        className="mb-2 custom-radio-group"
                        size="small"
                    >
                        <Radio.Button value="upload" className="!bg-neutral-900 !text-white !border-neutral-800">Upload File</Radio.Button>
                        <Radio.Button value="url" className="!bg-neutral-900 !text-white !border-neutral-800">Image URL</Radio.Button>
                    </Radio.Group>

                    {imageSource === 'upload' ? (
                        <Upload
                            beforeUpload={() => false}
                            maxCount={1}
                            onChange={handleImageChange}
                            listType="picture"
                            showUploadList={false}
                        >
                            <Button icon={<FiUpload />} className="w-full !bg-neutral-900 !border-neutral-850 hover:!border-[#D4AF37] hover:!text-[#D4AF37] !text-white flex items-center justify-center gap-1.5 h-10 rounded-lg">Upload Image</Button>
                        </Upload>
                    ) : (
                        <Input
                            placeholder="Paste image URL here (e.g. https://example.com/image.png)"
                            value={product?.imageFile?.startsWith('data:') ? '' : product?.imageFile}
                            onChange={(e) => setProduct({ ...product, imageFile: e.target.value })}
                            className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-10"
                        />
                    )}

                    {
                        product?.imageFile && (
                            <div className="mt-2 flex justify-center">
                                <Image 
                                    width={100} 
                                    className="block p-2 border border-neutral-900 bg-neutral-950 rounded-xl object-contain max-h-[100px]" 
                                    src={product?.imageFile} 
                                    fallback="https://placehold.co/100?text=No+Preview"
                                />
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
                {
                    isEdit ?
                        <div className="flex gap-4" >
                            <button 
                                onClick={handleEdit}
                                className="w-full h-10 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold rounded-lg shadow-md transition"
                            >
                                Update
                            </button>
                            <button 
                                onClick={()=>{
                                    setCurrentProduct(null);
                                    setOpen(false)
                                }}
                                className="w-full h-10 cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-red-500 text-white font-extrabold rounded-lg shadow-md transition"
                            >
                                Cancel
                            </button>
                        </div>
                        :
                        <button 
                            onClick={handleSubmit}
                            className="w-full h-10 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold rounded-lg shadow-md transition uppercase tracking-wider text-xs"
                        >
                            Submit Product
                        </button>
                }
            </div>
        </div>
    );
};

export default AddOrEditProduct;
