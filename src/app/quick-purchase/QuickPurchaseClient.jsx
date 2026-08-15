"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import _ from 'underscore';
import { HiFilter } from "react-icons/hi";
import { useCartStore } from '../../store/cartStore';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'next/navigation';
import { GrLinkNext } from "react-icons/gr";

export default function QuickPurchaseClient() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState({});
    const { products } = useCartStore();
    const { settings, crackers } = useUserStore();

    const [filter, setFilter] = useState("");

    useEffect(() => {
        if (filter === "") {
            const newData = _.groupBy(crackers, 'category');
            setData(newData);
            setFilteredData(newData);
        } else {
            const filtered = crackers?.filter((data) => data?.category === filter);
            setFilteredData(_.groupBy(filtered, 'category'));
        }
    }, [filter, crackers]);

    const total = useMemo(() => {
        var counts = 0, amount = 0;
        products?.forEach((prod) => {
            counts = counts + prod?.count;
            amount = amount + prod?.total;
        });
        return { counts, amount };
    }, [products]);

    return (
        <div className="w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col select-none" >
            <Header />

            {/* Viewport content height constraint for desktop with independent scrollable areas */}
            <div className="w-full lg:h-[calc(100vh-140px)] max-w-7xl mx-auto grid grid-cols-12 gap-6 p-4 sm:p-6 flex-grow overflow-hidden" >
                {/* Left filter panel */}
                <div className="hidden lg:block lg:col-span-3 bg-[#121212]/50 border border-neutral-900 rounded-2xl p-5 h-full overflow-y-auto scrollable flex flex-col" >
                    <div className="flex gap-2 items-center mb-6 pb-2 border-b border-neutral-900/60" >
                        <HiFilter className="text-xl text-[#D4AF37]" />
                        <p className="text-sm font-bold text-amber-100 uppercase tracking-wider m-0" >Filter by Category</p>
                    </div>

                    <div className="flex flex-col gap-2 flex-grow overflow-y-auto" >
                        {
                            data && Object.keys(data)?.map((key, index) => {
                                const isSelected = filter === key;
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between py-3 px-4 duration-300 rounded-xl select-none cursor-pointer border ${isSelected
                                            ? "bg-neutral-900 border-[#D4AF37]/50 text-white shadow-lg shadow-amber-500/5"
                                            : "bg-[#121212]/30 border-neutral-900 text-gray-400 hover:text-white hover:border-[#D4AF37]/25 hover:bg-[#121212]/50"
                                            }`}
                                        onClick={() => {
                                            setFilter(isSelected ? "" : key);
                                        }}
                                    >
                                        <p className="text-xs font-semibold tracking-wider uppercase m-0" >{key}</p>
                                        <p className={`text-xs px-2.5 py-0.5 rounded-full font-bold m-0 transition-colors duration-300 ${isSelected ? "bg-[#D4AF37] text-black" : "bg-neutral-950 text-[#D4AF37] border border-neutral-800"
                                            }`} >{data[key]?.length}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                {/* Right purchase form list */}
                <div className="col-span-12 lg:col-span-9 bg-[#121212]/30 border border-neutral-900 rounded-2xl p-5 md:p-6 h-full overflow-y-auto scrollable flex flex-col justify-between relative" >
                    <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white mb-1 uppercase">
                                    Quick <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Purchase</span>
                                </h1>
                                <p className="text-xs text-gray-400 font-light" >Enter the quantity of your required crackers and complete your booking.</p>
                            </div>

                            {/* Mobile visual category selector / clear filter */}
                            {filter && (
                                <button
                                    className="cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] text-gray-300 text-xs px-3.5 py-2 rounded-lg transition-all duration-300 self-start sm:self-auto"
                                    onClick={() => { setFilter(''); }}
                                >
                                    Show All Products
                                </button>
                            )}
                        </div>

                        <div className="w-full h-px bg-neutral-900/80 my-4" />

                        <div className="flex flex-col gap-6 mt-4 pb-20" >
                            {
                                filteredData && Object.keys(filteredData)?.map((category, index) => {
                                    return (
                                        <div key={index} className="space-y-3" >
                                            <div className="w-full flex items-center justify-center py-2 px-4 font-bold bg-[#121212]/80 border border-neutral-850 rounded-xl text-[#D4AF37] uppercase tracking-wider text-md mb-3" >
                                                <span>{category}</span>
                                            </div>
                                            <div className="flex flex-col gap-3" >
                                                {
                                                    filteredData[category]?.map((product, index) => {
                                                        return (
                                                            <ProductCard product={product} key={index} />
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>

                    {/* Bottom floating book summary card */}
                    <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center bg-[#121212] border border-neutral-800 sticky bottom-0 left-0 py-5 px-6 rounded-2xl shadow-2xl z-30 mt-6" >
                        <div className="flex flex-row md:flex-col justify-between w-full md:w-auto gap-2 border-b md:border-b-0 border-neutral-900/60 pb-3 md:pb-0" >
                            <p className="font-light text-xs text-gray-400 uppercase tracking-wider m-0" >Total Quantity : <strong className="text-white font-bold ml-1 text-sm">{total?.counts}</strong></p>
                            <p className="font-light text-xs text-gray-400 uppercase tracking-wider m-0" >Total Amount : <strong className="text-[#D4AF37] font-extrabold ml-1 text-base">Rs.{total?.amount}</strong> </p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end" >
                            <p className="text-[10px] text-amber-500/80 font-mono font-semibold uppercase tracking-wider text-center md:text-right m-0" >
                                Minimum order value Rs.{settings?.minimumAmount}
                            </p>
                            <button
                                className="w-full md:w-auto h-11 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold px-8 rounded-lg shadow-md transition duration-300 disabled:opacity-50 text-sm whitespace-nowrap flex items-center justify-center gap-2"
                                disabled={total?.amount < settings?.minimumAmount}
                                onClick={() => {
                                    router.push('/cart');
                                }}
                            >
                                Proceed to Book <GrLinkNext className="text-black" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
