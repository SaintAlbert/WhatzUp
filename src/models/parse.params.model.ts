export interface IParams {
    limit: number,
    page: number,
    privacity?: string,
    username?: string,
    words?: string,
    cache?: boolean,
    location?: any,
    category?: string,
    categorydate?: Date,
    country_city?: string,
    type?: number,
}

export interface IHandyParams {
    limit: number,
    page: number,
    id?: string,
    search?: string,
    username?: string,
    filter?: string,
    hashtags?: string,
    handyservice?: string,
    handyproduct?: string,
    words?: string,
    cache?: boolean,
    location?: any,
    country?: string,
    privacity?: string,
}

export interface IHandyGetParams {
    limit: number,
    page: number,
    mybooking?: boolean,
    user?: String,
}