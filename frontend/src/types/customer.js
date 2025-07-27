export const createEmptyCustomer = () => ({
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    role: 'customer',
    address: [],
    wishlist: [],
    cart: [],
    //loyaltyPoints : 0,
    isActive: true
});