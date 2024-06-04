interface Indexable {
    [key: string]: any;
}

export function ES6MapToObject(map: Map<any, any>) {
    let obj: Indexable = {};
    map.forEach((val, key) => {
        if (val instanceof Map) obj[key] = ES6MapToObject(val);
        else if (typeof val === 'object') obj[key] = ConvertTupleToSingleValue(val);
        else obj[key] = val;
    });
    return obj;
}

export function ConvertTupleToSingleValue(val: any): any {
    if (typeof val === 'object' && !val.length && !(val instanceof Date)) return ConvertTupleToSingleValue(val);
    else if (typeof val === 'object' && val.length && val.length === 1) return val[0];
    else return val;
}

type SafeParseJSONReturn = number | null | string | any[] | Record<string, any>

/**
 * @description Tries to parse a string to a POJO using `JSON.parse()`. If `JSON.parse()` throws an error it returns the input string,
 * otherwise returns the parsed object.
 * @param str String to be parsed as JSON
 * @example
 * ```ts
 *  let res = safeParseJSON("undefined"); // res = "undefined"
 *  res = safeParseJSON("a string literal"); // res = "a string literal";
 *  res = safeParseJSON("1"); // res = 1
 *  res = safeParseJSON('{ "a" : 1, "b": "val"}'); // res = { a : 1, b : "val"}
 *  res = safeParseJSON("[1,2,3]"); // res = [1,2,3]  
 * ``` 
 */
export function safeParseJSON(str: string): SafeParseJSONReturn {
    try {
        const obj = JSON.parse(str) as SafeParseJSONReturn;
        return obj
    } catch (e) {
        return str
    }
}

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





