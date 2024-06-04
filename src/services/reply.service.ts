import { NewDiscussionReply, UpdateDiscussionReply } from "@/types/database.types";
import { RdsClientV2 } from "@/utils/RdsClient";
import { db } from "@/utils/database-driver.utils";
import { sql } from "kysely";

const rds = new RdsClientV2()

class ReplyService {
    async createReply(body: NewDiscussionReply, qnId: number, userId: number) {
        try {
            const { reply_text } = body;
            const queryExpr = db.insertInto('misc_db.discussion_replies').values({
                qn_id: qnId,
                user_id: userId,
                reply_text,
            }).returning(['id', 'qn_id', 'reply_text'])

            const paramsObj = { qn_id: qnId, user_id: userId, reply_text }
            const rows = queryExpr.executeTakeFirst();
            type ResultType = Awaited<typeof rows>;
            const { sql, parameters } = await queryExpr.compile()
            const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
                sql: sql,
                params: { qn_id: qnId, user_id: userId, reply_text }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering creating discussion reply" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getAllReplies(qnId: number) {
        try {
            const [result, error] = await rds.query<{ qnId: number }, {}>({
                sql: `select dr.id as id, dr.reply_text, u.id as user_id , u.fullname,  dr.created_at , dr.updated_at  from misc_db."discussion_replies" dr
                inner join misc_db."user" u on u.id = dr.user_id
                where dr.qn_id = :qnId;`,
                params: { qnId }
            })
            if (error !== null) {
                throw new Error("Error quering get all replies by qnId" + error.message + error.stack)
            }
            return result.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async getReply() {
        try {

        } catch (error) {

        }
    }

    async editReply(replyId: number, body: UpdateDiscussionReply) {
        try {
            const { reply_text } = body;
            if (!reply_text) {
                throw new Error('reply text is required')
            }

            const queryExpr = db.updateTable('misc_db.discussion_replies').set({
                reply_text
            }).where('id', '=', replyId);

            const rows = queryExpr.executeTakeFirst();
            const paramsObj = { reply_text, id: replyId }
            type ResultType = Awaited<typeof rows>;

            const { sql, parameters } = await queryExpr.compile();
            const [result, error] = await rds.queryOne<typeof paramsObj, ResultType>({
                sql,
                params: { reply_text, id: replyId }
            }, parameters);

            if (error !== null) {
                throw new Error("Error quering edit reply" + error.message + error.stack)
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    async deleteReply(replyId: number) {
        try {
            const [result, error] = await rds.queryOne<{ replyId: number }, {}>({
                sql: `DELETE FROM misc_db.discussion_replies
                WHERE id= :replyId`,
                params: { replyId }
            })

            if (error !== null) {
                throw new Error("Error quering delete reply" + error.message + error.stack)
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }
}

export const replyService = new ReplyService();