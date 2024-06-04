export function pick<T = any>(obj: Record<string, any>, keys: string[]) {
    const obj_0: Record<string, any> = {};

    keys.forEach(key => {
        if (key in obj) obj_0[key] = obj[key];
    })

    return obj_0 as T;
}

export function enumerate<T>(arr: T[]) {
    const enumerated_array: [number, T][] = []
    for (let index in arr) {
        enumerated_array.push([Number(index), arr[index]])
    }

    return enumerated_array
}