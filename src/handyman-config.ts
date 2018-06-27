
export interface EnumPackageItem {
   label: string, desc: string, price: any, symbol: any, code: any;
}
export interface EnumServiceItems extends Array<EnumPackageItem> { }

export const handy: any = [
    {
        id: 0,
        name: 'Beauty',
        src: 'assets/img/cat/hm_item1.png',
        style: 'hm_border_top_none hm_border_left_none',
        class: 'beauty'
    },
    {
        id: 1,
        name: 'Health',
        src: 'assets/img/cat/hm_item2.png',
        style: 'hm_border_top_none hm_border_left_none',
        class: 'health'
    },
    {
        id: 2,
        name: 'Lessons',
        src: 'assets/img/cat/hm_item3.png',
        style: 'hm_border_top_none hm_border_left_none ',
        class: 'lesson'
    },
    {
        id: 3,
        name: 'Home Service',
        src: 'assets/img/cat/hm_item4.png',
        style: 'hm_border_top_none hm_border_left_none hm_border_right_none',
        class: 'homeservice'
    },
    {
        id: 4,
        name: 'Business',
        src: 'assets/img/cat/hm_item5.png',
        style: 'hm_border_bottom_none hm_border_left_none',
        class: 'business'
    },
    {
        id: 5,
        name: 'Events',
        src: 'assets/img/cat/hm_item6.png',
        style: 'hm_border_bottom_none hm_border_left_none',
        class: 'event'
    },
    {
        id: 6,
        name: 'Hobbies',
        src: 'assets/img/cat/hm_item7.png',
        style: 'hm_border_bottom_none hm_border_left_none',
        class: 'hobbie'
    },
    {
        id: 7,
        name: 'Repairs',
        src: 'assets/img/cat/hm_item8.png',
        style: 'hm_border_bottom_none hm_border_left_none hm_border_right_none',
        class: 'repair'
    }
]

export const handycategory: any = [
    {
        id: 0,
        image: '',
        objname: 'HandyBeauty',
        style: 'hm_service_div',
        user: null,
        item: [
            {
                name: 'Spa',
                src: 'assets/img/cat/hm_spa.png',
                packageList: [],
            },
            {
                name: 'Fitness',
                src: 'assets/img/cat/hm_fitness.png',
                packageList: [],
            },
            {
                name: 'Makeup',
                src: 'assets/img/cat/hm_makeup.png',
                packageList: [],
            },
            {
                name: 'Salon',
                src: 'assets/img/cat/hm_salon.png',
                packageList: [],
            },
            {
                name: 'Yoga',
                src: 'assets/img/cat/hm_yoga.png',
                packageList: [],
            },
            {
                name: 'Ayurveda',
                src: 'assets/img/cat/hm_ayurveda.png',
                packageList: [],
            }
        ],
    },
    {
        id: 1,
        image: '',
        objname: 'HandyHealth',
        style: 'hm_service_div',
        user: null,
        item: [
            {
                name: 'Diet',
                src: 'assets/img/cat/hm_diet.png',
                packageList: [],
            },
            {
                name: 'Fitness',
                src: 'assets/img/cat/hm_fitness.png',
                packageList: [],
            },
            {
                name: 'Streching',
                src: 'assets/img/cat/hm_strech.png',
                packageList: [],
            },
            {
                name: 'Yoga',
                src: 'assets/img/cat/hm_yoga.png',
                packageList: [],
            },
            {
                name: 'Massage',
                src: 'assets/img/cat/hm_massage.png',
                packageList: [],
            },
            {
                name: 'Fat loss',
                src: 'assets/img/cat/hm_fatloss.png',
                packageList: [],
            }
        ]
        ,
    },
    {
        id: 2,
        image: '',
        objname: 'HandyLessons',
        style: 'hm_service_div',
        user: null,
        item: [
            {
                name: 'Education',
                src: 'assets/img/cat/hm_education.png',
                packageList: [],
            },
            {
                name: 'Language',
                src: 'assets/img/cat/hm_lan.png',
                packageList: [],
            },
            {
                name: 'Streching',
                src: 'assets/img/cat/hm_strech.png',
                packageList: [],
            },
            {
                name: 'Driving',
                src: 'assets/img/cat/hm_driving.png',
                packageList: [],
            },
            {
                name: 'Dance',
                src: 'assets/img/cat/hm_dance.png',
                packageList: [],
            },
            {
                name: 'Art',
                src: 'assets/img/cat/hm_art.png',
                packageList: [],
            }
        ]
    },
    {
        id: 3,
        image: '',
        objname: 'HandyHomeService',
        style: 'hm_service_div',
        user: null,
        item: [
            {
                name: 'Furnishing',
                src: 'assets/img/cat/hm_furnish.png',
                packageList: [],
            },
            {
                name: 'Painting',
                src: 'assets/img/cat/hm_painting.png',
                packageList: [],
            },
            {
                name: 'Cleaning',
                src: 'assets/img/cat/hm_clean.png',
                packageList: [],
            },
            {
                name: 'Floor',
                src: 'assets/img/cat/hm_floor.png',
                packageList: [],
            },
            {
                name: 'Electrical',
                src: 'assets/img/cat/hm_electrical.png',
                packageList: [],
            },
            {
                name: 'Plumbing',
                src: 'assets/img/cat/hm_plumbing.png',
                packageList: [],
            }
        ]
    },
    {
        id: 4,
        image: '',
        objname: 'HandyBusiness',
        style: 'hm_service_div',
        user: null,
        item: [
            {
                name: 'Marketing',
                src: 'assets/img/cat/hm_marketing.png',
                packageList: [],
            },
            {
                name: 'Branding',
                src: 'assets/img/cat/hm_branding.png',
                packageList: [],
            },
            {
                name: 'Office',
                src: 'assets/img/cat/hm_office.png',
                packageList: [],
            },
            {
                name: 'Security',
                src: 'assets/img/cat/hm_security.png',
                packageList: [],
            },
            {
                name: 'Admin',
                src: 'assets/img/cat/hm_admin.png',
                packageList: [],
            },
            {
                name: 'Analytics',
                src: 'assets/img/cat/hm_analytic.png',
                packageList: [],
            }
        ]
    },
    {
        id: 5,
        image: '',
        objname: 'HandyEvents',
        style: 'hm_service_div',
        user: null,
        item: [
            {
                name: 'Marriage',
                src: 'assets/img/cat/hm_marriage.png',
                packageList: [],
            },
            {
                name: 'DJ',
                src: 'assets/img/cat/hm_dj.png',
                packageList: [],
            },
            {
                name: 'Inaguration',
                src: 'assets/img/cat/hm_inaguaration.png',
                packageList: [],
            },
            {
                name: 'Lighting',
                src: 'assets/img/cat/hm_lighting.png',
                packageList: [],
            },
            {
                name: 'Decoration',
                src: 'assets/img/cat/hm_decoration.png',
                packageList: [],
            },
            {
                name: 'Catering',
                src: 'assets/img/cat/hm_catering.png',
                packageList: [],
            }
        ]
    },
    {
        id: 6,
        image: '',
        objname: 'HandyHobbies',
        style: 'hm_service_div',
        user: null,
        item: [
            {
                name: 'Art',
                src: 'assets/img/cat/hm_art.png',
                packageList: [],
            },
            {
                name: 'Music',
                src: 'assets/img/cat/hm_music.png',
                packageList: [],
            },
            {
                name: 'Dance',
                src: 'assets/img/cat/hm_dance.png',
                packageList: [],
            },
            {
                name: 'Sports',
                src: 'assets/img/cat/hm_sports.png',
                packageList: [],
            },
            {
                name: 'Photography',
                src: 'assets/img/cat/hm_photo.png',
                packageList: [],
            },
            {
                name: 'Gaming',
                src: 'assets/img/cat/hm_gaming.png',
                packageList: [],
            }
        ]
    },
    {
        id: 7,
        image: '',
        objname: 'HandyRepairs',
        style: 'hm_service_div',
        user: null,
        item: [
            {
                name: 'PC/Laptop',
                src: 'assets/img/cat/hm_pc.png',
                packageList: [],
            },
            {
                name: 'Car',
                src: 'assets/img/cat/hm_car.png',
                packageList: [],
            },
            {
                name: 'Motorcycle',
                src: 'assets/img/cat/hm_motorcycle.png',
                packageList: [],
            },
            {
                name: 'Appliances',
                src: 'assets/img/cat/hm_appliance.png',
                packageList: [],
            },
            {
                name: 'Camera',
                src: 'assets/img/cat/hm_photo.png',
                packageList: [],
            },
            {
                name: 'Console',
                src: 'assets/img/cat/hm_gaming.png',
                packageList: [],
            }
        ]
    }

]



