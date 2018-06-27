
export interface IUpcoming {
    id?: string,
    title?: string,
    privacity: string,
    photo: any,
    address?: any,
    location?: any,
    save?: any,
    description?: string,
    category?: any,
    categoryId?: any,
    currencyId: any,
    currency?: any,
    code?: any,
    symbol?: any,
    startDate?: Date,
    endDate?: Date,
    price?: any,
    vip?: any,
    executive?: any,
    priceType?: boolean
    canbook?: boolean,
    chargefee?: any,
    attendant?: any
    publicfee?: any,
    frendship?: any,
    contact?:any
}


export interface IUpcomingFollow {
    userId: string;
    galleryId: string;
}
