export const createAuthSlice = (set, get) => ({
    isAuthenticated:false,
    user:{},
    setAuthenticateSuccess:(user)=>{
        set((state)=>({
            ...state,
            isAuthenticated:true,
            user:user
        }))
    },
    setAuthenticateFailure:()=>{
        set((state)=>({
            ...state,
            isAuthenticated:false,
            user:{}
        }))
    }
})
