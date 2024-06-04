//helper function to get the cache key for video progress
export function getCacheKey(user_id: number, id: number, type: string) {
    return `user:${user_id}:${type}:${id}`
}
