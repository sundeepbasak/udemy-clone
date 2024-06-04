import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

//"misc_db.user" --> user  

export interface Database {
    'misc_db.user': UserTable,
    'misc_db.category': CategoryTable,
    'misc_db.sub_category': SubCategoryTable,
    'misc_db.course': CourseTable,
    'misc_db.section': SectionTable,
    'misc_db.video': VideoTable,
    'misc_db.roles': RolesTable,
    'misc_db.user_roles': UserRolesTable,

    'misc_db.course_enrollments': CourseEnrollmentsTable,
    'misc_db.watch_history': WatchHistoryTable,

    //dicussion_forum
    'misc_db.discussion_qns': DiscussionQuestionTable,
    'misc_db.discussion_replies': DiscussionReplyTable,

    // cart: CartTable,
    // orders: OrderTable,
    // order_item: OrderItemTable,
    'misc_db.payments': PaymentsTable
}

export interface UserTable {
    id: Generated<number>,
    fullname: string,
    email: string,
    password?: string,
    avatar: string | null,
    created_at: ColumnType<Date, string | undefined, never>,
    is_verified?: boolean,
    is_active?: boolean
}

export interface CategoryTable {
    id: Generated<number>
    name: string
}

export interface SubCategoryTable {
    id: Generated<number>
    name: string
    category_id: number
}

export interface CourseTable {
    id: Generated<number>,
    title: string,
    course_slug: string,
    description: string,
    thumbnail: string,
    instructor: string,
    category_id: number,
    sub_category_id: number,
    tags?: string, //comma separated 
    requirements?: string,
    contents?: string,
    is_published: boolean,
    is_free: boolean,
    mrp_price: number,
    discount: number,
    created_at: ColumnType<Date, string | undefined, never>,
    updated_at: ColumnType<Date, string | undefined>,
}

export interface SectionTable {
    id: Generated<number>,
    title: string,
    description: string,
    order: number,
    course_id: number
}

export interface VideoTable {
    id: Generated<number>,
    title: string,
    url: string,
    order: number,
    previewable: boolean,
    section_id: number
}

export interface CourseEnrollmentsTable {
    id: Generated<number>,
    user_id: number,
    course_id: number,
    date: ColumnType<Date, string | undefined, never>,
    payment_id?: number | null
}

export interface CartTable {
    id: Generated<number>,
    course_id: number,
    cart_id: number
}

type OrderStatus = 'pending' | 'completed'

export interface OrderTable {
    id: Generated<number>,
    user_id: number,
    total: number,
    status: OrderStatus,
    date: ColumnType<Date, string | undefined, never>,
}

export interface OrderItemTable {
    id: Generated<number>,
    order_id: number,
    course_id: number
}

export interface PaymentsTable {
    id: Generated<number>,
    user_id: number,
    course_id: number,
    amount: number,
    date: ColumnType<Date, string | undefined, never>,
    status: boolean
    method: string
}

export interface WatchHistoryTable {
    id: Generated<number>,
    user_id: number,
    video_id: number,
    course_id: number,
    progress: number,
    completed: boolean,
    last_watched_at: string
}


type Operation = 'create' | 'read' | 'update' | 'delete'
type OperationMap = Record<Operation, boolean>

export type PermissionMatrix = Record<string, OperationMap>

export interface RolesTable {
    id: Generated<number>,
    name: string,
    permission_matrix: PermissionMatrix
}

export interface UserRolesTable {
    id: Generated<number>,
    user_id: number,
    role_id: number
}

//for discussion_forum
export interface DiscussionQuestionTable {
    id: Generated<number>,
    course_id: number,
    user_id: number,
    qn_title: string,
    qn_detail?: string,
    created_at: ColumnType<Date, string | undefined, never>,
    updated_at: ColumnType<Date, string | undefined, never>,
}

export interface DiscussionReplyTable {
    id: Generated<number>,
    qn_id: number,
    user_id: number,
    reply_text: string,
    created_at: ColumnType<Date, string | undefined, never>,
    updated_at: ColumnType<Date, string | undefined, never>,
}

//CREATE
export type NewUser = Insertable<UserTable>
export type NewRole = Insertable<RolesTable>
export type NewCourse = Insertable<CourseTable>
export type NewSection = Insertable<SectionTable>
export type NewVideo = Insertable<VideoTable>
export type NewCategory = Insertable<CategoryTable>
export type NewSubCategory = Insertable<SubCategoryTable>
export type NewCourseEnrollment = Insertable<CourseEnrollmentsTable>
export type NewWatchHistory = Insertable<WatchHistoryTable>
export type NewDiscussionQuestion = Insertable<DiscussionQuestionTable>
export type NewDiscussionReply = Insertable<DiscussionReplyTable>

//EDIT
export type UpdateUser = Updateable<UserTable>
export type UpdateRole = Updateable<RolesTable>
export type UpdateCourse = Updateable<CourseTable>
export type UpdateSection = Updateable<SectionTable>
export type UpdateVideo = Updateable<VideoTable>
export type UpdateCategory = Updateable<CategoryTable>
export type UpdateSubCategory = Updateable<SubCategoryTable>
export type UpdateCourseEnrollment = Updateable<CourseEnrollmentsTable>
export type UpdateWatchHistory = Updateable<WatchHistoryTable>
export type UpdateDiscussionQuestion = Updateable<DiscussionQuestionTable>
export type UpdateDiscussionReply = Updateable<DiscussionReplyTable>

