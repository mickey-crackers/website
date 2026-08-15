export const createCartSlice = (set, get) => ({
    products:[],
    appliedCoupon:null,
    setProducts:(products)=>{
        set((state)=>({
            ...state,
            products:products
        }))
    },
    setAppliedCoupon:(coupon)=>{
        set((state)=>({
            ...state,
            appliedCoupon:coupon
        }))
    },
})
