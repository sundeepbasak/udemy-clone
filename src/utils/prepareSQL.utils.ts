
export function prepareStatement(sql: string, fields?: string[]) {
    if (fields) {
        for (let i = 0; i < fields.length; i++) {
            const reg = new RegExp('\\$' + (i + 1), "i");
            sql = sql.replace(reg, ":" + fields?.[i])
        }
        return sql;
    }
    return sql
}